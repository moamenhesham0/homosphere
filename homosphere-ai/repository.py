import os
from typing import Optional, Dict
from datetime import datetime
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv

class TrendRepository:
    """Repository for managing market trend data."""
    
    def __init__(self):
        """Initialize the repository with Supabase PostgreSQL connection."""
        try:
            load_dotenv()
        except Exception:
            # dotenv optional: if not available, rely on env
            pass

        user = os.getenv("DB_USER")
        password = os.getenv("DB_PASSWORD")
        host = os.getenv("DB_HOST")
        port = os.getenv("DB_PORT")
        dbname = os.getenv("DB_NAME")

        # Validate credentials are provided
        if not all([user, password, host, port, dbname]):
            raise ValueError(
                "Database connection credentials are not fully set. Please set all required environment variables."
            )

        # Initialize PostgreSQL connection
        try:
            self.connection = psycopg2.connect(
                user=user,
                password=password,
                host=host,
                port=port,
                dbname=dbname,
            )
            self.connection.autocommit = True  # Enable autocommit for immediate persistence
            print("Connected successfully to Supabase PostgreSQL")
            self._verify_connection()
        except Exception as e:
            raise ConnectionError(f"Failed to connect to database: {str(e)}")
    
    def _verify_connection(self):
        """Verify that the connection to Supabase is working and table exists."""
        try:
            cursor = self.connection.cursor()
            cursor.execute("SELECT 1 FROM zip_trends LIMIT 1;")
            cursor.close()
            print("zip_trends table is accessible")
        except psycopg2.errors.UndefinedTable:
            raise ConnectionError(
                "zip_trends table does not exist. Please run the SQL script to create it."
            )
        except Exception as e:
            raise ConnectionError(
                f"Cannot access zip_trends table. Error: {str(e)}"
            )
    
    def get_trend(self, zip_code: str) -> float:
        """
        Get the trend factor for a zip code.
        
        Args:
            zip_code: The zip code to query
            
        Returns:
            The trend factor (defaults to 1.0 if not found)
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(
                "SELECT factor FROM zip_trends WHERE zip_code = %s LIMIT 1;",
                (zip_code,)
            )
            result = cursor.fetchone()
            cursor.close()
            
            if result:
                return float(result[0])
        except Exception as e:
            raise ConnectionError(f"Failed to retrieve trend from database: {str(e)}")

        # Return default if no record found
        return float(1.0)
    
    def get_trend_with_metadata(self, zip_code: str) -> Optional[Dict]:
        """
        Get the full trend record including timestamps.
        
        Args:
            zip_code: The zip code to query
            
        Returns:
            Dictionary with factor, created_at, updated_at or None
        """
        try:
            cursor = self.connection.cursor(cursor_factory=RealDictCursor)
            cursor.execute(
                "SELECT zip_code, factor, created_at, updated_at FROM zip_trends WHERE zip_code = %s LIMIT 1;",
                (zip_code,)
            )
            result = cursor.fetchone()
            cursor.close()
            
            if result:
                return {
                    "zip_code": result["zip_code"],
                    "factor": float(result["factor"]),
                    "created_at": result["created_at"].isoformat() if result["created_at"] else None,
                    "updated_at": result["updated_at"].isoformat() if result["updated_at"] else None
                }
        except Exception as e:
            raise ConnectionError(f"Failed to retrieve trend metadata from database: {str(e)}")
        
        return None
    
    def upsert_trend(self, zip_code: str, factor: float) -> None:
        """
        Insert or update the trend factor for a zip code.
        
        Args:
            zip_code: The zip code to update
            factor: The new trend factor
        """
        try:
            cursor = self.connection.cursor()
            cursor.execute(
                """
                INSERT INTO zip_trends (zip_code, factor, created_at, updated_at)
                VALUES (%s, %s, NOW(), NOW())
                ON CONFLICT (zip_code) 
                DO UPDATE SET factor = EXCLUDED.factor, updated_at = NOW();
                """,
                (zip_code, factor)
            )
            cursor.close()
        except Exception as e:
            raise ConnectionError(f"Failed to upsert trend to database: {str(e)}")


class ModelRepository:
    """Repository for managing the CatBoost model."""
    
    def __init__(self, model_path: str = 'house_price_model.cbm'):
        """
        Initialize the model repository and load the model.
        
        Args:
            model_path: Path to the CatBoost model file
        """
        from catboost import CatBoostRegressor
        
        self.model = CatBoostRegressor()
        try:
            self.model.load_model(model_path)
            print("Model loaded successfully!")
        except Exception as e:
            print(f"ERROR: Could not load model. {e}")
            raise
    
    def get_model(self):
        """Return the loaded CatBoost model."""
        return self.model
