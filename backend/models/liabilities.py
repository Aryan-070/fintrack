from pydantic import condecimal, field_validator
from models.base import BaseModel, PydanticUUID4, Optional
from datetime import date  # Change from datetime to date

class LiabilityBase(BaseModel):
    liability_type: str
    description: Optional[str] = None
    amount: condecimal(max_digits=12, decimal_places=2)
    due_date: Optional[date] = None  # Use date instead of datetime
    
    @field_validator("liability_type", mode="before")
    def validate_liability_type(cls, value):
        return value.lower()

class LiabilityCreate(LiabilityBase):
    user_id: PydanticUUID4

class Liability(LiabilityBase):
    id: int
    user_id: PydanticUUID4 