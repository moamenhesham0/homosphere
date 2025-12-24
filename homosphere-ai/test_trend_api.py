import os
from unittest.mock import Mock, MagicMock
from datetime import datetime
from fastapi import FastAPI
from fastapi.testclient import TestClient

# Mock the database connection before importing repository modules
os.environ["DB_USER"] = "test_user"
os.environ["DB_PASSWORD"] = "test_password"
os.environ["DB_HOST"] = "localhost"
os.environ["DB_PORT"] = "5432"
os.environ["DB_NAME"] = "test_db"

from repository import ModelRepository, TrendRepository
from service import PredictionService, TrendService
from controller import PredictionController, TrendController


class MockTrendRepository:
    """Mock TrendRepository for testing without database."""
    
    def __init__(self):
        self.trends = {}  # In-memory storage for trends
    
    def get_trend(self, zip_code: str) -> float:
        """Get trend factor, defaulting to 1.0 if not found."""
        return self.trends.get(zip_code, {}).get("factor", 1.0)
    
    def get_trend_with_metadata(self, zip_code: str):
        """Get full trend record with metadata."""
        if zip_code in self.trends:
            return self.trends[zip_code]
        return None
    
    def upsert_trend(self, zip_code: str, factor: float) -> None:
        """Insert or update trend factor."""
        now = datetime.now()
        if zip_code in self.trends:
            self.trends[zip_code]["factor"] = factor
            self.trends[zip_code]["updated_at"] = now.isoformat()
        else:
            self.trends[zip_code] = {
                "zip_code": zip_code,
                "factor": factor,
                "created_at": now.isoformat(),
                "updated_at": now.isoformat()
            }


class MockModelRepository:
    """Mock ModelRepository for testing."""
    
    def __init__(self):
        self.mock_model = Mock()
        self.mock_model.predict.return_value = [200000]
    
    def get_model(self):
        """Return mock model."""
        return self.mock_model


def create_test_app():
    """Create a test FastAPI application with mock repositories."""
    app = FastAPI(title="Test House Price Predictor API")
    
    # Initialize mock repositories
    mock_model_repository = MockModelRepository()
    mock_trend_repository = MockTrendRepository()
    
    # Initialize services with mock repositories
    prediction_service = PredictionService(mock_model_repository, mock_trend_repository)
    trend_service = TrendService(mock_trend_repository)
    
    # Initialize controllers
    prediction_controller = PredictionController(prediction_service)
    trend_controller = TrendController(trend_service)
    
    # Register routers
    app.include_router(prediction_controller.router)
    app.include_router(trend_controller.router)
    
    # Store references for testing
    app.state.model_repository = mock_model_repository
    app.state.trend_repository = mock_trend_repository
    
    return app


# Create test client with mocked app
test_app = create_test_app()
client = TestClient(test_app)


def test_get_trend_default():
    """Test getting trend for zip code with no stored value (should default to 1.0)."""
    r = client.get("/trend/00000")
    assert r.status_code == 200
    response_data = r.json()
    assert response_data["current_trend_factor"] == 1.0
    assert response_data["status"] == "using_default"
    assert response_data["zip_code"] == "00000"


def test_update_trend():
    """Test updating trend factor for a zip code."""
    r = client.post("/trend", json={"zip_code": "94105", "factor": 1.05})
    assert r.status_code == 200
    response_data = r.json()
    assert response_data["zip_code"] == "94105"
    assert response_data["new_factor"] == 1.05
    assert "updated successfully" in response_data["message"]


def test_get_trend_after_update():
    """Test retrieving a trend after it has been updated."""
    # First, update the trend
    client.post("/trend", json={"zip_code": "94106", "factor": 1.10})
    
    # Then retrieve it
    r = client.get("/trend/94106")
    assert r.status_code == 200
    response_data = r.json()
    assert response_data["current_trend_factor"] == 1.10
    assert response_data["status"] == "active"


def test_predict_applies_trend():
    """Test that prediction applies the market trend factor."""
    # Set up a trend for the zip code
    client.post("/trend", json={"zip_code": "94105", "factor": 1.05})
    
    payload = {
        "bed": 3,
        "bath": 2,
        "city": "Test",
        "state": "TS",
        "zip_code": "94105",
        "house_size": 1500,
        "lot_size_sqft": 3000,
    }
    
    r = client.post("/predict", json=payload)
    assert r.status_code == 200
    response_data = r.json()
    assert response_data["base_ai_price"] == 200000.0
    assert response_data["market_trend_factor"] == 1.05
    assert response_data["final_estimated_price"] == round(200000 * 1.05, 2)


def test_predict_without_trend():
    """Test prediction for zip code without stored trend (should use default 1.0)."""
    payload = {
        "bed": 4,
        "bath": 3,
        "city": "TestCity",
        "state": "TC",
        "zip_code": "99999",
        "house_size": 2000,
        "lot_size_sqft": 4000,
    }
    
    r = client.post("/predict", json=payload)
    assert r.status_code == 200
    response_data = r.json()
    assert response_data["base_ai_price"] == 200000.0
    assert response_data["market_trend_factor"] == 1.0
    assert response_data["final_estimated_price"] == 200000.0


def test_update_existing_trend():
    """Test updating an existing trend factor."""
    # Create initial trend
    client.post("/trend", json={"zip_code": "94107", "factor": 1.05})
    
    # Update it
    r = client.post("/trend", json={"zip_code": "94107", "factor": 1.15})
    assert r.status_code == 200
    
    # Verify the update
    r = client.get("/trend/94107")
    assert r.status_code == 200
    assert r.json()["current_trend_factor"] == 1.15
