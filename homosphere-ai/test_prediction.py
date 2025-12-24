import pandas as pd
from catboost import CatBoostRegressor

# 1. Load Model
model = CatBoostRegressor()
model.load_model('house_price_model.cbm')

# 2. Define Test Cases
test_cases = [
    {
        "name": "The Average Joe (Standard Suburban)",
        "bed": 3, "bath": 2, 
        "city": "Houston", "state": "Texas", "zip_code": "77002",
        "house_size": 1800, "lot_size_sqft": 6000
    },
    {
        "name": "The Beverly Hills Mansion (Luxury)",
        "bed": 6, "bath": 5, 
        "city": "Beverly Hills", "state": "California", "zip_code": "90210",
        "house_size": 6500, "lot_size_sqft": 20000
    },
    {
        "name": "NYC Shoebox (High Density/Expensive)",
        "bed": 1, "bath": 1, 
        "city": "New York", "state": "New York", "zip_code": "10001",
        "house_size": 650, "lot_size_sqft": 0
    },
    {
        "name": "Rural Farmhouse (Huge Land, Small House)",
        "bed": 3, "bath": 1, 
        "city": "Springfield", "state": "Missouri", "zip_code": "65802",
        "house_size": 1500, "lot_size_sqft": 217800 # 5 Acres
    },
    {
        "name": "Detroit Fixer-Upper (Low Cost)",
        "bed": 2, "bath": 1, 
        "city": "Detroit", "state": "Michigan", "zip_code": "48214",
        "house_size": 1100, "lot_size_sqft": 4000
    }
]

# 3. Run Predictions
print(f"{'TEST CASE NAME':<40} | {'PREDICTED PRICE':>15}")
print("-" * 60)

for case in test_cases:
    # Convert single dictionary to DataFrame
    input_df = pd.DataFrame([case]).drop(columns=['name'])
    
    # Predict
    price = model.predict(input_df)[0]
    
    print(f"{case['name']:<40} | ${price:,.2f}")