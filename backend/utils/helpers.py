from typing import Dict, Any
from decimal import Decimal
from datetime import datetime, date
from uuid import UUID

def prepare_data_for_supabase(data: Dict[str, Any]) -> Dict[str, Any]:
    """Process model data to make it compatible with Supabase."""
    result = {}
    
    for key, value in data.items():
        if value is None:
            result[key] = None
        elif key == "user_id":
            # Always convert user_id to string
            result[key] = str(value)
        elif isinstance(value, Decimal):
            result[key] = float(value)
        elif isinstance(value, datetime):
            result[key] = value.isoformat()
        elif isinstance(value, date):
            result[key] = value.isoformat()
        else:
            result[key] = value
    
    return result 