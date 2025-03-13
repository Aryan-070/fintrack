import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration variables
SUPABASE_URL = os.getenv("PYTHON_SUPABASE_URL")
SUPABASE_KEY = os.getenv("PYTHON_SUPABASE_ANON_KEY") 