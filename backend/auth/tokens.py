import jwt
import secrets
from datetime import datetime, timedelta
from typing import Dict

# These should be in environment variables in a real application
JWT_SECRET_KEY = "iGNixuhaOM0zSYabR8XxYiGYMpe5yzNN+e9PU49Z2ZjLnR5iQbAKumuN3AQyFkLuYqYDxsYDJ/KH19/JGtvkcg"  # Change this to a secure random key!
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_MINUTES = 30
REFRESH_TOKEN_EXPIRATION_DAYS = 7

def generate_jwt_token(user_id: str) -> str:
    """
    Generate a JWT token for the given user_id.
    """
    expiration = datetime.utcnow() + timedelta(minutes=JWT_EXPIRATION_MINUTES)
    
    payload = {
        "sub": user_id,
        "exp": expiration,
        "iat": datetime.utcnow(),
        "type": "access"
    }
    
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)

def generate_refresh_token(user_id: str) -> str:
    """
    Generate a refresh token for the given user_id.
    This could be a simple random string or another JWT with longer expiration.
    """
    # Option 1: Using a JWT for refresh token
    expiration = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRATION_DAYS)
    
    payload = {
        "sub": user_id,
        "exp": expiration,
        "iat": datetime.utcnow(),
        "type": "refresh"
    }
    
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    
    # Option 2: Using a random token (uncomment to use this instead)
    # return secrets.token_urlsafe(64) 