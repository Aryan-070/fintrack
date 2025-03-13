import os
import logging
from dotenv import load_dotenv
from supabase import create_client, Client
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from functools import lru_cache
from concurrent.futures import ThreadPoolExecutor

import requests
# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(title="Financial Management API")
executor = ThreadPoolExecutor()

# Get allowed origins from environment or use default for local development
#FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
ALLOWED_ORIGINS = [
    #FRONTEND_URL,
    "https://fin-ance-tracking.netlify.app",  # Your Netlify URL - without path
    "http://localhost:5173",
    "http://localhost:3000",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    logger.info(f"Response status: {response.status_code}")
    return response

# Initialize Supabase client
try:
    supabase_url = os.getenv("PYTHON_SUPABASE_URL")
    supabase_key = os.getenv("PYTHON_SUPABASE_ANON_KEY")
    
    if not supabase_url or not supabase_key:
        raise ValueError("Missing Supabase credentials")
    
    logger.info(f"Initializing Supabase client with URL: {supabase_url}")
    supabase = create_client(supabase_url, supabase_key)
    logger.info("Supabase client initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize Supabase client: {str(e)}")
    raise

# Import JWT verification dependency
from auth.dependencies import verify_token

# Import routers
from routers import assets, liabilities, transactions, investments, dashboard, users

# Add users router without authentication
app.include_router(users.router)

# Add all other routers with JWT authentication
app.include_router(
    assets.router,
    dependencies=[Depends(verify_token)]
)
app.include_router(
    liabilities.router,
    dependencies=[Depends(verify_token)]
)
app.include_router(
    transactions.router,
    dependencies=[Depends(verify_token)]
)
app.include_router(
    investments.router,
    dependencies=[Depends(verify_token)]
)
app.include_router(
    dashboard.router,
    dependencies=[Depends(verify_token)]
)

# Root endpoint for health checks
@app.get("/")
async def root():
    return {"status": "healthy", "message": "FinTrack API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
