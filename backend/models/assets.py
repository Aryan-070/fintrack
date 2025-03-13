from pydantic import condecimal, field_validator, Field, BaseModel as PydanticBaseModel
from models.base import PydanticUUID4, Optional
from datetime import date
from typing import Any
from decimal import Decimal
class AssetBase(PydanticBaseModel):
    asset_type: str
    asset_name: Optional[str] = None
    value: condecimal(max_digits=12, decimal_places=2)
    acquired_date: Optional[date] = None
    
    class Config:
        json_encoders = {
             date: lambda v: v.isoformat() if v else None,  # Convert date to string
            Decimal: lambda v: float(v)  # Convert Decimal to float
        }
        from_attributes = True

class AssetCreate(AssetBase):
    user_id: PydanticUUID4
    acquired_date: Optional[date] = None

class Asset(AssetBase):
    id: int
    user_id: PydanticUUID4
    acquired_date: Optional[date] = Field(default=None, json_schema_extra={"example": "2024-03-11"})
 