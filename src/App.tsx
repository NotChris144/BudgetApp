import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { DollarSign, User, Home, Plus } from 'lucide-react';
import ExpensesScreen from './components/ExpensesScreen';
import HomeScreen from './components/HomeScreen';
import SettingsScreen from './components/SettingsScreen';
import MoneyInput from './components/MoneyInput';
import { AppData, Transaction, Expense } from './types';
import { v4 as uuidv4 } from 'uuid';

const initialAppData: AppData = {
  expenses: [],
  income: 0,
  dailyBudget: 0,
  transactions: [],
  username: 'User',
};

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [appData, setAppData] = useState<AppData>(initialAppData);
  const [virtualDate, setVirtualDate] = useState(new Date());

  useEffect(() => {
    const savedData = localStorage.getItem('appData');
    if (savedData) {
      setAppData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('appData', JSON.stringify(appData));
  }, [appData]);

  const addTransaction = (amount: number) => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      amount,
      date: virtualDate.toISOString(),
    };

    setAppData(prev => ({
      ...prev,
      transactions: [...prev.transactions, newTransaction],
    }));
  };

  const removeTransaction = (index: number) => {
    setAppData(prev => ({
      ...prev,
      transactions: prev.transactions.filter((_, i) => i !== index),
    }));
  };

  const addExpense = (expense: Expense) => {
    setAppData(prev => ({
      ...prev,
      expenses: [...prev.expenses, expense],
    }));
  };

  const removeExpense = (index: number) => {
    setAppData(prev => ({
      ...prev,
      expenses: prev.expenses.filter((_, i) => i !== index),
    }));
  };

  const updateSettings = (income: number, dailyBudget: number, username: string) => {
    setAppData(prev => ({
      ...prev,
      income,
      dailyBudget,
      username,
    }));
  };

  const handleAddTransaction = (amount: number) => {
    addTransaction(amount);
    setShowAddTransaction(false);
  };

  return (
    <div className="mobile-container">
      <div className="page-content">
        <Routes>
          <Route
            path="/"
            element={
              <HomeScreen
                dailyBudget={appData.dailyBudget}
                transactions={appData.transactions}
                addTransaction={addTransaction}
                removeTransaction={removeTransaction}
                username={appData.username}
                currentDate={virtualDate}
                setCurrentDate={setVirtualDate}
                onAddTransaction={() => setShowAddTransaction(true)}
              />
            }
          />
          <Route
            path="/expenses"
            element={
              <ExpensesScreen
                expenses={appData.expenses}
                income={appData.income}
                addExpense={addExpense}
                removeExpense={removeExpense}
              />
            }
          />
          <Route
            path="/settings"
            element={
              <SettingsScreen
                income={appData.income}
                dailyBudget={appData.dailyBudget}
                updateSettings={updateSettings}
                totalExpenses={appData.expenses.reduce((sum, exp) => sum + exp.amount, 0)}
                username={appData.username}
              />
            }
          />
        </Routes>
      </div>

      <div className="nav-wrapper">
        <nav className="bottom-nav">
          <button
            onClick={() => navigate('/expenses')}
            className={`nav-button ${location.pathname === '/expenses' ? 'active' : ''}`}
          >
            <DollarSign className="nav-icon" />
            <span className="nav-label">Expenses</span>
          </button>

          <button
            onClick={() => {
              if (location.pathname === '/') {
                setShowAddTransaction(true);
              } else {
                navigate('/');
              }
            }}
            className={`nav-button ${location.pathname === '/' ? 'add-button' : ''}`}
          >
            {location.pathname === '/' ? (
              <div className="add-transaction-button">
                <Plus className="nav-icon" />
              </div>
            ) : (
              <>
                <Home className="nav-icon" />
                <span className="nav-label">Home</span>
              </>
            )}
          </button>

          <button
            onClick={() => navigate('/settings')}
            className={`nav-button ${location.pathname === '/settings' ? 'active' : ''}`}
          >
            <User className="nav-icon" />
            <span className="nav-label">Profile</span>
          </button>
        </nav>
      </div>

      {showAddTransaction && (
        <div className="modal-wrapper">
          <MoneyInput
            onClose={() => setShowAddTransaction(false)}
            onSubmit={handleAddTransaction}
          />
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;