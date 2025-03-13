from fastapi import APIRouter, HTTPException, status
from typing import List
from models.assets import Asset, AssetCreate, AssetBase
from db.crud import create_entity, get_entity_by_id, get_entities_by_user, update_entity, delete_entity
from datetime import date

router = APIRouter(
    prefix="/api/assets",
    tags=["assets"]
)

@router.post("/", response_model=Asset)
async def create_asset(asset: AssetCreate):
       
    return await create_entity(asset, "assets")

@router.get("/{asset_id}", response_model=Asset)
async def get_asset(asset_id: int):
    asset = await get_entity_by_id(asset_id, "assets")
    return asset

@router.get("/user/{user_id}", response_model=List[Asset])
async def get_user_assets(user_id: str):
    data = await get_entities_by_user(user_id, "assets")
    
    # Process date fields
    for asset in data:
        if isinstance(asset.get("acquired_date"), str):
            try:
                asset["acquired_date"] = date.fromisoformat(asset["acquired_date"])
            except (ValueError, TypeError):
                asset["acquired_date"] = None
    
    return data

@router.put("/{asset_id}", response_model=Asset)
async def update_asset(asset_id: int, asset: AssetBase):
    # Prepare asset for update
    asset_dict = asset.model_dump()
    if asset_dict.get("acquired_date"):
        asset_dict["acquired_date"] = asset_dict["acquired_date"].isoformat()
    asset_dict["value"] = float(asset_dict["value"])
    
    return await update_entity(asset_id, asset_dict, "assets")

@router.delete("/{asset_id}")
async def delete_asset(asset_id: int):
    return await delete_entity(asset_id, "assets") 