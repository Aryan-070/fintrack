from pydantic import BaseModel

# Using Supabase Auth models instead of custom definitions
# The supabase-py client handles authentication and user management

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    
    