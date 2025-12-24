import React, { useState } from 'react';
import '../styles/AIPredictionButton.css';

const AIPredictionButton = ({ propertyData, onPredictionResult }) => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      // Prepare the data for the AI prediction API
      const predictionData = {
        bed: propertyData.bedrooms,
        bath: propertyData.bathrooms,
        city: propertyData.city || propertyData.location?.city,
        state: propertyData.state || propertyData.location?.state,
        zip_code: propertyData.zipCode || propertyData.location?.zipCode,
        house_size: propertyData.propertyAreaInSquareFeet || propertyData.propertyAreaSqFt,
        lot_size_sqft: propertyData.lotAreaInSquareFeet || propertyData.lotAreaSqFt,
      };

      // Call the AI prediction API
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData),
      });

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const result = await response.json();
      if (result.final_estimated_price) {
        console.log('AI Prediction Result:', result);
        // Map backend response to the shape expected by this component/UI
        setPrediction({
          predicted_price: result.final_estimated_price,
          base_ai_price: result.base_ai_price,
          market_trend_factor: result.market_trend_factor,
        });
      }
      
      if (onPredictionResult) {
        onPredictionResult(result);
      }
    } catch (err) {
      setError(err.message || 'Failed to get AI prediction');
      console.error('Prediction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="ai-prediction-container">
      <button
        className="ai-prediction-btn"
        onClick={handlePredict}
        disabled={loading}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
        {loading ? 'Predicting...' : 'AI Price Prediction'}
      </button>

      {error && (
        <div className="prediction-error">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {prediction && (
        <div className="prediction-result">
          <div className="prediction-header">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <h4>AI Prediction Result</h4>
          </div>
          <div className="prediction-content">
            <div className="prediction-item">
              <span className="prediction-label">Predicted Price:</span>
              <span className="prediction-value">{formatPrice(prediction.predicted_price)}</span>
            </div>
            {prediction.market_trend_factor && (
              <div className="prediction-item">
                <span className="prediction-label">Market Trend Factor:</span>
                <span className="prediction-value">{(prediction.market_trend_factor)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPredictionButton;
