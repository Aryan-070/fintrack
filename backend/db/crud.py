from typing import Dict, Any, List
from fastapi import HTTPException
from pydantic import BaseModel
from uuid import UUID
from db.database import supabase
from config import logger
from utils.helpers import prepare_data_for_supabase

async def create_entity(entity: BaseModel, table_name: str) -> Dict[str, Any]:
    """Generic function to create an entity in the database."""
    try:
        # Get data as dict and process it for Supabase
        raw_data = entity.model_dump()
        logger.info(f"Creating entity in {table_name}: {raw_data}")
        
        # Process data without modifying original
        data = prepare_data_for_supabase(raw_data)
        
        response = supabase.table(table_name).insert(data).execute()
        if not response.data:
            logger.error(f"Failed to create entity in {table_name}")
            raise HTTPException(status_code=400, detail="Failed to create entity")
        logger.info(f"Successfully created entity in {table_name}: {response.data[0]}")
        return response.data[0]
    except Exception as e:
        logger.error(f"Error creating entity in {table_name}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

async def get_entity_by_id(entity_id: int, table_name: str) -> Dict[str, Any]:
    """Generic function to get an entity by ID."""
    try:
        response = supabase.table(table_name).select("*").eq("id", entity_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail=f"Entity not found in {table_name}")
        return response.data[0]
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def get_entities_by_user(user_id: str, table_name: str) -> List[Dict[str, Any]]:
    """Generic function to get all entities for a user."""
    try:
        # Validate UUID format (but don't try to modify it)
        try:
            if isinstance(user_id, UUID):
                # Already a UUID object, convert to string for Supabase
                user_id_str = str(user_id)
            else:
                # Validate format by creating a UUID object (not stored)
                UUID(user_id)
                user_id_str = user_id
        except ValueError:
            logger.error(f"Invalid UUID format: {user_id}")
            raise HTTPException(status_code=400, detail="Invalid user ID format")
            
        logger.info(f"Getting entities from {table_name} for user: {user_id}")
        response = supabase.table(table_name).select("*").eq("user_id", user_id_str).execute()
        
        # Process the data to handle null dates properly
        if response.data:
            for item in response.data:
                # If acquired_date is None, ensure it stays None
                if 'acquired_date' in item and item['acquired_date'] is None:
                    # Keep it as None
                    pass
                elif 'acquired_date' in item and item['acquired_date']:
                    # Try to convert to a string format that won't fail validation
                    try:
                        # Strip any time portion to keep just the date
                        if 'T' in item['acquired_date']:
                            item['acquired_date'] = item['acquired_date'].split('T')[0]
                    except (TypeError, AttributeError):
                        # If any error, set to None
                        item['acquired_date'] = None
                
                # Same for due_date in liabilities
                if 'due_date' in item and item['due_date'] is None:
                    # Keep it as None
                    pass
                elif 'due_date' in item and item['due_date']:
                    try:
                        if 'T' in item['due_date']:
                            item['due_date'] = item['due_date'].split('T')[0]
                    except (TypeError, AttributeError):
                        item['due_date'] = None
        
        logger.info(f"Found {len(response.data)} entities in {table_name} for user: {user_id}")
        return response.data
    except Exception as e:
        logger.error(f"Error getting entities from {table_name} for user {user_id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

async def update_entity(entity_id: int, entity: BaseModel, table_name: str) -> Dict[str, Any]:
    """Generic function to update an entity."""
    try:
        # Get data as dict and process it for Supabase
        raw_data = entity.model_dump()
        logger.info(f"Updating entity in {table_name}: {raw_data}")
        
        # Process data without modifying original
        data = prepare_data_for_supabase(raw_data)
        
        response = supabase.table(table_name).update(data).eq("id", entity_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail=f"Entity not found in {table_name}")
        return response.data[0]
    except Exception as e:
        logger.error(f"Error updating entity in {table_name}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

async def delete_entity(entity_id: int, table_name: str) -> Dict[str, Any]:
    """Generic function to delete an entity."""
    try:
        response = supabase.table(table_name).delete().eq("id", entity_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail=f"Entity not found in {table_name}")
        return {"message": f"Entity deleted successfully from {table_name}"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

async def get_user_by_email(email: str):
    """Get a user by email."""
    try:
        response = supabase.table("users").select("*").eq("email", email).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"Error getting user by email: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

async def get_user_by_id(user_id: str):
    """Get a user by ID."""
    try:
        response = supabase.table("users").select("*").eq("id", user_id).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"Error getting user by ID: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

async def create_user(user_data: dict):
    """Create a new user."""
    try:
        response = supabase.table("users").insert(user_data).execute()
        return response.data[0] if response.data else None
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e)) 