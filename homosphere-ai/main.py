import os
from fastapi import FastAPI
import uvicorn

from repository import ModelRepository, TrendRepository
from service import PredictionService, TrendService
from controller import PredictionController, TrendController

# Get the directory where this script is located
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, 'house_price_model.cbm')

# Initialize the FastAPI application
app = FastAPI(title="House Price Predictor API")

# Initialize repositories
model_repository = ModelRepository(MODEL_PATH)
trend_repository = TrendRepository()

# Initialize services
prediction_service = PredictionService(model_repository, trend_repository)
trend_service = TrendService(trend_repository)

# Initialize controllers
prediction_controller = PredictionController(prediction_service)
trend_controller = TrendController(trend_service)

# Register routers
app.include_router(prediction_controller.router)
app.include_router(trend_controller.router)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)