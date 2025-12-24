from fastapi import APIRouter

from models import HouseQuery, TrendUpdate, PredictionResponse, TrendResponse, TrendUpdateResponse
from service import PredictionService, TrendService


class PredictionController:
    """Controller for house price prediction endpoints."""
    
    def __init__(self, prediction_service: PredictionService):
        """
        Initialize the prediction controller.
        
        Args:
            prediction_service: Service for prediction logic
        """
        self.prediction_service = prediction_service
        self.router = APIRouter()
        self._setup_routes()
    
    def _setup_routes(self):
        """Setup API routes for prediction."""
        
        @self.router.post("/predict", response_model=PredictionResponse)
        def predict_price(house: HouseQuery):
            """
            Predict house price based on input features.
            
            Args:
                house: House features for prediction
                
            Returns:
                Prediction with base price, trend factor, and final price
            """
            return self.prediction_service.predict_price(house)


class TrendController:
    """Controller for market trend endpoints."""
    
    def __init__(self, trend_service: TrendService):
        """
        Initialize the trend controller.
        
        Args:
            trend_service: Service for trend logic
        """
        self.trend_service = trend_service
        self.router = APIRouter()
        self._setup_routes()
    
    def _setup_routes(self):
        """Setup API routes for trends."""
        
        @self.router.get("/trend/{zip_code}", response_model=TrendResponse)
        def get_trend(zip_code: str):
            """
            Get the current market trend for a zip code.
            
            Args:
                zip_code: The zip code to query
                
            Returns:
                Current trend factor and status
            """
            return self.trend_service.get_trend(zip_code)
        
        @self.router.post("/trend", response_model=TrendUpdateResponse)
        def update_trend(trend: TrendUpdate):
            """
            Update the market trend for a zip code.
            
            Args:
                trend: Zip code and new trend factor
                
            Returns:
                Confirmation of the update
            """
            return self.trend_service.update_trend(trend.zip_code, trend.factor)
