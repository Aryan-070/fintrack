from fastapi import APIRouter, HTTPException
from typing import List
from models.transactions import Transaction, TransactionCreate, TransactionBase
from db.crud import create_entity, get_entity_by_id, get_entities_by_user, update_entity, delete_entity
from models.base import PydanticUUID4

router = APIRouter(
    prefix="/api/transactions",
    tags=["transactions"]
)

@router.post("/", response_model=Transaction)
async def create_transaction(transaction: TransactionCreate):
    return await create_entity(transaction, "transactions")

@router.get("/{transaction_id}", response_model=Transaction)
async def get_transaction(transaction_id: int):
    return await get_entity_by_id(transaction_id, "transactions")

@router.get("/user/{user_id}", response_model=List[Transaction])
async def get_user_transactions(user_id: PydanticUUID4):
    return await get_entities_by_user(str(user_id), "transactions")

@router.put("/{transaction_id}", response_model=Transaction)
async def update_transaction(transaction_id: int, transaction: TransactionBase):
    return await update_entity(transaction_id, transaction, "transactions")

@router.delete("/{transaction_id}")
async def delete_transaction(transaction_id: int):
    return await delete_entity(transaction_id, "transactions") 