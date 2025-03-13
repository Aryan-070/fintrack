import os
import requests
import asyncio
import logging
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from functools import lru_cache, partial
from concurrent.futures import ThreadPoolExecutor
from supabase import create_client, Client
from auth.tokens import generate_jwt_token, generate_refresh_token

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables once
load_dotenv()
SUPABASE_URL = os.getenv("PYTHON_SUPABASE_URL")
SERVICE_ROLE_KEY = os.getenv("PYTHON_SUPABASE_SERVICE_ROLE_KEY")
if not SUPABASE_URL or not SERVICE_ROLE_KEY:
    logger.error("Missing Supabase URL or service role key")
    raise ValueError("Supabase configuration missing")

# Initialize a global ThreadPoolExecutor
executor = ThreadPoolExecutor()

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

@lru_cache()
def get_supabase_client() -> Client:
    # Create and cache the Supabase client using the service role key
    return create_client(SUPABASE_URL, SERVICE_ROLE_KEY)

def fetch_user_by_id(user_id: str) -> dict:
    # Construct the URL and headers only once using module-level variables
    url = f"{SUPABASE_URL}/auth/v1/admin/users/{user_id}"
    headers = {
        "apikey": SERVICE_ROLE_KEY,
        "Authorization": f"Bearer {SERVICE_ROLE_KEY}",
    }
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        logger.error(f"Error fetching user {user_id}: {response.text}")
        raise Exception(f"Error fetching user: {response.text}")
    return response.json()

@router.get("/{user_id}")
async def get_user_aud(user_id: str):
    loop = asyncio.get_running_loop()
    try:
        # Use functools.partial to pass user_id into fetch_user_by_id
        user = await loop.run_in_executor(executor, partial(fetch_user_by_id, user_id))
        # Extract only the "aud" field from the user object
        aud = user.get("aud")
        if aud is None:
            logger.warning(f"'aud' field not found for user {user_id}")
            raise HTTPException(status_code=404, detail="aud field not found for user")
        
        # Check if aud is "authenticated" and generate tokens if it is
        if aud == "authenticated":
            # Generate JWT token and refresh token
            jwt_token = generate_jwt_token(user_id)
            refresh_token = generate_refresh_token(user_id)
            
            logger.info(f"Successfully authenticated user {user_id}, returning tokens")
            return {
                "aud": aud,
                "jwt_token": jwt_token,
                "refresh_token": refresh_token
            }
        
        logger.info(f"Successfully retrieved aud for user {user_id}")
        return {"aud": aud}
    except Exception as e:
        logger.error(f"Error retrieving 'aud' for user {user_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve user: {str(e)}")
