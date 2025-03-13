from fastapi import APIRouter, HTTPException
from typing import List
from models.investments import Investment, InvestmentCreate, InvestmentBase
from db.crud import create_entity, get_entity_by_id, get_entities_by_user, update_entity, delete_entity
from models.base import PydanticUUID4

router = APIRouter(
    prefix="/api/investments",
    tags=["investments"]
)

@router.post("/", response_model=Investment)
async def create_investment(investment: InvestmentCreate):
    return await create_entity(investment, "investment_portfolio")

@router.get("/{investment_id}", response_model=Investment)
async def get_investment(investment_id: int):
    return await get_entity_by_id(investment_id, "investment_portfolio")

@router.get("/user/{user_id}", response_model=List[Investment])
async def get_user_investments(user_id: PydanticUUID4):
    return await get_entities_by_user(str(user_id), "investment_portfolio")

@router.put("/{investment_id}", response_model=Investment)
async def update_investment(investment_id: int, investment: InvestmentBase):
    return await update_entity(investment_id, investment, "investment_portfolio")

@router.delete("/{investment_id}")
async def delete_investment(investment_id: int):
    return await delete_entity(investment_id, "investment_portfolio") 