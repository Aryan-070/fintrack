from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from datetime import datetime
from uuid import UUID
from collections import defaultdict
from db.database import supabase
from config import logger

# Define the router
router = APIRouter(
    prefix="/api/dashboard",
    tags=["dashboard"]
)

# Define the DashboardData model
from pydantic import BaseModel

class DashboardData(BaseModel):
    totalIncome: float = 0
    totalExpenses: float = 0
    netWorth: float = 0
    monthlyData: List[Dict[str, Any]] = []
    expenseCategories: List[Dict[str, Any]] = []

@router.get("/{user_id}", response_model=DashboardData)
async def get_dashboard_data(user_id: str):
    try:
        # Validate UUID format (but don't try to modify it)
        try:
            if isinstance(user_id, UUID):
                user_id_str = str(user_id)
            else:
                UUID(user_id)
                user_id_str = user_id
                
            logger.info(f"Generating dashboard data for user: {user_id}")
        except ValueError:
            logger.error(f"Invalid UUID format: {user_id}")
            raise HTTPException(status_code=400, detail="Invalid user ID format")
        
        # Get all transactions for the user
        transactions_response = supabase.table("transactions").select("*").eq("user_id", user_id_str).execute()
        transactions = transactions_response.data if transactions_response.data else []
        
        # Get all assets for the user
        assets_response = supabase.table("assets").select("*").eq("user_id", user_id_str).execute()
        assets = assets_response.data if assets_response.data else []
        
        # Get all liabilities for the user
        liabilities_response = supabase.table("liabilities").select("*").eq("user_id", user_id_str).execute()
        liabilities = liabilities_response.data if liabilities_response.data else []
        
        # Calculate total income and expenses
        total_income = sum(float(t.get("amount", 0)) for t in transactions if t.get("transaction_type") == "income")
        total_expenses = sum(float(t.get("amount", 0)) for t in transactions if t.get("transaction_type") == "expense")
        
        # Calculate net worth (assets - liabilities)
        total_assets = sum(float(a.get("value", 0)) for a in assets)
        total_liabilities = sum(float(l.get("amount", 0)) for l in liabilities)
        net_worth = total_assets - total_liabilities
        
        # Calculate monthly data (last 6 months)
        monthly_data = []
        
        # Create a dictionary to store monthly totals
        monthly_totals = defaultdict(lambda: {"month": "", "income": 0, "expense": 0})
        
        # Process each transaction
        for transaction in transactions:
            try:
                # Get the transaction date
                date_str = transaction.get("transaction_date")
                
                # Skip if no date
                if not date_str:
                    continue
                
                # Convert string date to datetime
                if isinstance(date_str, str):
                    # Handle different date formats
                    if 'T' in date_str:
                        date_str = date_str.split('T')[0]
                    transaction_date = datetime.strptime(date_str, "%Y-%m-%d")
                else:
                    continue
                
                # Format month name
                month_key = transaction_date.strftime("%Y-%m")
                month_name = transaction_date.strftime("%b %Y")
                
                # Update monthly totals
                monthly_totals[month_key]["month"] = month_name
                amount = float(transaction.get("amount", 0))
                
                if transaction.get("transaction_type") == "income":
                    monthly_totals[month_key]["income"] += amount
                elif transaction.get("transaction_type") == "expense":
                    monthly_totals[month_key]["expense"] += amount
                
            except Exception as e:
                logger.warning(f"Error processing transaction date: {e}")
                continue
        
        # Convert to list and sort by date (most recent first)
        monthly_data = list(monthly_totals.values())
        
        # Sort monthly data
        try:
            monthly_data.sort(key=lambda x: datetime.strptime(x["month"], "%b %Y"), reverse=True)
        except Exception as e:
            logger.warning(f"Error sorting monthly data: {e}")
        
        # Limit to last 6 months
        monthly_data = monthly_data[:6]
        
        # Calculate expense categories
        expense_categories = defaultdict(float)
        for transaction in transactions:
            if transaction.get("transaction_type") == "expense":
                category = transaction.get("category_type", "uncategorized")
                amount = float(transaction.get("amount", 0))
                expense_categories[category] += amount
        
        # Convert to list of dictionaries
        expense_categories_list = [
            {"category": category, "amount": amount}
            for category, amount in expense_categories.items()
        ]
        
        # Sort by amount (highest first)
        expense_categories_list.sort(key=lambda x: x["amount"], reverse=True)
        
        # Create dashboard data
        dashboard_data = {
            "totalIncome": total_income,
            "totalExpenses": total_expenses,
            "netWorth": net_worth,
            "monthlyData": monthly_data,
            "expenseCategories": expense_categories_list
        }
        
        logger.info(f"Dashboard data generated successfully for user: {user_id}")
        return dashboard_data
        
    except Exception as e:
        logger.error(f"Error generating dashboard data for user {user_id}: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e)) 