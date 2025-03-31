from pydantic import condecimal, field_validator
from models.base import BaseModel, PydanticUUID4, Optional, datetime

class TransactionBase(BaseModel):
    amount: condecimal(max_digits=12, decimal_places=2)
    category_type: str
    transaction_type: str
    location: str
    description: Optional[str] = None
    is_recurring: bool = False
    
    @field_validator("transaction_type", mode="before")
    def validate_transaction_type(cls, value):
        return value.lower()

class TransactionCreate(TransactionBase):
    user_id: PydanticUUID4
    transaction_date: Optional[datetime] = None

class Transaction(TransactionBase):
    id: int
    user_id: PydanticUUID4
    transaction_date: Optional[datetime] = None 