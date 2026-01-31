from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class HouseQuery(BaseModel):
    """Model for house price prediction request."""
    bed: float
    bath: float
    city: str
    state: str
    zip_code: str  # Critical: Must be string!
    house_size: float
    lot_size_sqft: float


class TrendUpdate(BaseModel):
    """Model for market trend update request."""
    zip_code: str
    factor: float  # e.g., 1.05 for +5%, 0.90 for -10%


class PredictionResponse(BaseModel):
    """Model for house price prediction response."""
    base_ai_price: float
    market_trend_factor: float
    final_estimated_price: float


class TrendResponse(BaseModel):
    """Model for market trend response."""
    zip_code: str
    current_trend_factor: float
    status: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class TrendUpdateResponse(BaseModel):
    """Model for market trend update response."""
    zip_code: str
    new_factor: float
    message: str
    updated_at: Optional[str] = None


class ZipTrendDB(BaseModel):
    """Database model for zip code trends."""
    zip_code: str
    factor: float
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
