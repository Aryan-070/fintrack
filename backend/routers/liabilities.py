from fastapi import APIRouter, HTTPException
from typing import List
from models.liabilities import Liability, LiabilityCreate, LiabilityBase
from db.crud import create_entity, get_entity_by_id, get_entities_by_user, update_entity, delete_entity
from models.base import PydanticUUID4

router = APIRouter(
    prefix="/api/liabilities",
    tags=["liabilities"]
)

@router.post("/", response_model=Liability)
async def create_liability(liability: LiabilityCreate):
    return await create_entity(liability, "liabilities")

@router.get("/{liability_id}", response_model=Liability)
async def get_liability(liability_id: int):
    return await get_entity_by_id(liability_id, "liabilities")

@router.get("/user/{user_id}", response_model=List[Liability])
async def get_user_liabilities(user_id: PydanticUUID4):
    return await get_entities_by_user(str(user_id), "liabilities")

@router.put("/{liability_id}", response_model=Liability)
async def update_liability(liability_id: int, liability: LiabilityBase):
    return await update_entity(liability_id, liability, "liabilities")

@router.delete("/{liability_id}")
async def delete_liability(liability_id: int):
    return await delete_entity(liability_id, "liabilities") 