# FinTrack - Personal Finance Management System

FinTrack is a comprehensive financial management application that helps users track their income, expenses, assets, liabilities, and investments to gain better control over their financial health.

## 🚀 Features

- **User Authentication**: Secure login/signup system
- **Dashboard**: Visual overview of financial health with charts and summaries
- **Transaction Management**: Track income and expenses with categorization
- **Asset Tracking**: Monitor your assets and their current values
- **Liability Management**: Keep track of debts and loans
- **Investment Portfolio**: Track investment performance
- **Reports & Analytics**: Generate insights about spending patterns and financial trends
- **Settings**: Personalize your FinTrack experience

## 💻 Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: Supabase
- **Authentication**: JWT-based authentication
- **Dependencies**:
  - fastapi - High-performance API framework
  - uvicorn - ASGI server for FastAPI
  - supabase - Database and authentication
  - python-dotenv - Environment variable management
  - pydantic - Data validation

### Frontend
- **Framework**: React (Vite)
- **Styling**: TailwindCSS
- **State Management**: React Context API
- **Data Fetching**: TanStack React Query
- **Routing**: React Router
- **Charts**: Chart.js with react-chartjs-2
- **Notifications**: React Toastify

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- Python (v3.10+ recommended)
- Supabase account

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

5. Create a `.env` file in the backend directory with the following variables:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   JWT_SECRET=your_jwt_secret
   ```

6. Start the backend server:
   ```
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_URL=http://localhost:8000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## 🔄 Database Setup
FinTrack uses Supabase for database management. You'll need to:

1. Create a Supabase project
2. Set up the following tables:
   - users
   - transactions
   - assets
   - liabilities
   - investments

Refer to the models directory in the backend for detailed schema information.

## 🛠️ Development

### Backend Development
The backend is structured with:
- `main.py` - FastAPI application entry point
- `models/` - Data models and Pydantic schemas
- `routers/` - API route handlers
- `auth/` - Authentication logic
- `db/` - Database connection and CRUD operations
- `utils/` - Helper functions

### Frontend Development
The frontend follows a modular structure:
- `src/components/` - Reusable UI components
- `src/pages/` - Application pages
- `src/context/` - React Context providers
- `src/services/` - API service functions
- `src/utils/` - Helper functions

## 📝 License
[MIT License](LICENSE)

## 👤 Author
Aryan Shah

---

Feel free to contribute to this project by opening issues or submitting pull requests! 