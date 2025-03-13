export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const TRANSACTION_CATEGORIES = {
  [TRANSACTION_TYPES.INCOME]: [
    { id: 'salary', name: 'Salary' },
    { id: 'bonus', name: 'Bonus' },
    { id: 'rental', name: 'Rental Income' },
    { id: 'freelance', name: 'Freelance' },
    { id: 'investment', name: 'Investment' },
    { id: 'other_income', name: 'Other Income' },
  ],
  [TRANSACTION_TYPES.EXPENSE]: [
    { id: 'rent', name: 'Rent/Mortgage' },
    { id: 'food', name: 'Food & Groceries' },
    { id: 'utilities', name: 'Utilities' },
    { id: 'transportation', name: 'Transportation' },
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'travel', name: 'Travel' },
    { id: 'shopping', name: 'Shopping' },
    { id: 'education', name: 'Education' },
    { id: 'other_expense', name: 'Other Expense' },
  ],
};

// Helper function to get category name by ID
export const getCategoryNameById = (type, categoryId) => {
  try {
    // Validate the type parameter
    if (!type || !TRANSACTION_CATEGORIES[type]) {
      console.warn(`Invalid transaction type: ${type}`);
      return categoryId || 'Unknown';
    }
    
    // Find the category
    const category = TRANSACTION_CATEGORIES[type].find(cat => cat.id === categoryId);
    return category ? category.name : (categoryId || 'Unknown');
  } catch (error) {
    console.error("Error getting category name:", error);
    return categoryId || 'Unknown';
  }
}; 