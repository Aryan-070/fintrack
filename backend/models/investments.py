from pydantic import condecimal, field_validator
from models.base import BaseModel, PydanticUUID4, Optional, datetime

class InvestmentBase(BaseModel):
    investment_type: str
    asset_name: str
    quantity: condecimal(max_digits=10, decimal_places=2)
    purchase_price: condecimal(max_digits=12, decimal_places=2)
    current_value: condecimal(max_digits=12, decimal_places=2)
    
    @field_validator("investment_type", mode="before")
    def validate_investment_type(cls, value):
        return value.lower()

class InvestmentCreate(InvestmentBase):
    user_id: PydanticUUID4
    purchase_date: Optional[datetime] = None

class Investment(InvestmentBase):
    id: int
    user_id: PydanticUUID4
    purchase_date: datetime 