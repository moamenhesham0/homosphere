import pandas as pd
from fastapi import HTTPException

from models import HouseQuery, PredictionResponse, TrendResponse, TrendUpdateResponse
from repository import TrendRepository, ModelRepository


class PredictionService:
    """Service for house price prediction logic."""
    
    def __init__(self, model_repository: ModelRepository, trend_repository: TrendRepository):
        """
        Initialize the prediction service.
        
        Args:
            model_repository: Repository for accessing the ML model
            trend_repository: Repository for accessing trend data
        """
        self.model_repository = model_repository
        self.trend_repository = trend_repository
    
    def predict_price(self, house: HouseQuery) -> PredictionResponse:
        """
        Predict house price based on input features and market trends.
        
        Args:
            house: House features for prediction
            
        Returns:
            Prediction response with base price, trend factor, and final price
            
        Raises:
            HTTPException: If model prediction fails
        """
        # Prepare input data
        input_data = pd.DataFrame([{
            'bed': house.bed,
            'bath': house.bath,
            'city': house.city,
            'state': house.state,
            'zip_code': house.zip_code,
            'house_size': house.house_size,
            'lot_size_sqft': house.lot_size_sqft
        }])
        
        # Get base AI price
        try:
            model = self.model_repository.get_model()
            base_price = model.predict(input_data)[0]
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Model Error: {str(e)}")
        
        # Apply market trend logic
        market_factor = self.trend_repository.get_trend(house.zip_code)
        final_price = base_price * market_factor
        
        return PredictionResponse(
            base_ai_price=round(base_price, 2),
            market_trend_factor=market_factor,
            final_estimated_price=round(final_price, 2)
        )


class TrendService:
    """Service for market trend management logic."""
    
    def __init__(self, trend_repository: TrendRepository):
        """
        Initialize the trend service.
        
        Args:
            trend_repository: Repository for accessing trend data
        """
        self.trend_repository = trend_repository
    
    def get_trend(self, zip_code: str) -> TrendResponse:
        """
        Get the current market trend for a zip code.
        
        Args:
            zip_code: The zip code to query
            
        Returns:
            Trend response with current factor, status, and timestamps
        """
        # Get full metadata from Supabase
        metadata = self.trend_repository.get_trend_with_metadata(zip_code)
        
        if metadata:
            factor = metadata.get("factor", 1.0)
            status = "active" if factor != 1.0 else "using_default"
            
            return TrendResponse(
                zip_code=zip_code,
                current_trend_factor=factor,
                status=status,
                created_at=metadata.get("created_at"),
                updated_at=metadata.get("updated_at")
            )
        else:
            # No record exists for this zip code, return default
            return TrendResponse(
                zip_code=zip_code,
                current_trend_factor=1.0,
                status="using_default",
                created_at=None,
                updated_at=None
            )
    
    def update_trend(self, zip_code: str, factor: float) -> TrendUpdateResponse:
        """
        Update the market trend for a zip code.
        
        Args:
            zip_code: The zip code to update
            factor: The new trend factor
            
        Returns:
            Update response confirming the change
            
        Raises:
            HTTPException: If factor is outside valid range
        """
        # Validate factor (reasonable bounds)
        if not (0.01 <= factor <= 10.0):
            raise HTTPException(
                status_code=400,
                detail="factor must be between 0.01 and 10.0"
            )
        
        self.trend_repository.upsert_trend(zip_code, factor)
        
        # Get the updated record with timestamp
        metadata = self.trend_repository.get_trend_with_metadata(zip_code)
        updated_at = metadata.get("updated_at") if metadata else None
        
        return TrendUpdateResponse(
            zip_code=zip_code,
            new_factor=factor,
            message=f"Market trend for {zip_code} updated successfully.",
            updated_at=updated_at
        )
