import React, { useState, useEffect, useCallback } from 'react';
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

function App() {
  const [activeScreen, setActiveScreen] = useState<'expenses' | 'home' | 'settings'>('home');
  const [appData, setAppData] = useState<AppData>(initialAppData);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [virtualDate, setVirtualDate] = useState(new Date());

  useEffect(() => {
    const storedData = localStorage.getItem('budgetAppData');
    if (storedData) {
      setAppData(JSON.parse(storedData));
    }
  }, []);

  const saveDataLocally = useCallback((data: AppData) => {
    localStorage.setItem('budgetAppData', JSON.stringify(data));
  }, []);

  const calculateDailyBudget = useCallback((income: number, expenses: Expense[]) => {
    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const availableAmount = income - totalExpenses;
    const dailyAmountWithoutBuffer = availableAmount / 30;
    const bufferAmount = dailyAmountWithoutBuffer * 0.2;
    const dailyBudgetWithBuffer = Math.max(dailyAmountWithoutBuffer - bufferAmount, 0);
    return Math.floor(dailyBudgetWithBuffer);
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setAppData((prevData) => {
      const newExpense = { ...expense, id: uuidv4() };
      const newExpenses = [...prevData.expenses, newExpense];
      const newDailyBudget = calculateDailyBudget(prevData.income, newExpenses);
      const newData = {
        ...prevData,
        expenses: newExpenses,
        dailyBudget: newDailyBudget,
      };
      saveDataLocally(newData);
      return newData;
    });
  }, [calculateDailyBudget, saveDataLocally]);

  const removeExpense = useCallback((id: string) => {
    setAppData((prevData) => {
      const newExpenses = prevData.expenses.filter(expense => expense.id !== id);
      const newDailyBudget = calculateDailyBudget(prevData.income, newExpenses);
      const newData = {
        ...prevData,
        expenses: newExpenses,
        dailyBudget: newDailyBudget,
      };
      saveDataLocally(newData);
      return newData;
    });
  }, [calculateDailyBudget, saveDataLocally]);

  const addTransaction = useCallback((amount: number) => {
    const transaction: Transaction = {
      date: virtualDate.toISOString().split('T')[0],
      amount,
      category: 'Quick Entry',
    };
    
    setAppData((prevData) => {
      const newData = {
        ...prevData,
        transactions: [...prevData.transactions, transaction],
      };
      saveDataLocally(newData);
      return newData;
    });
    setShowAddTransaction(false);
  }, [virtualDate, saveDataLocally]);

  const removeTransaction = useCallback((index: number) => {
    setAppData((prevData) => {
      const newTransactions = [...prevData.transactions];
      newTransactions.splice(index, 1);
      const newData = {
        ...prevData,
        transactions: newTransactions,
      };
      saveDataLocally(newData);
      return newData;
    });
  }, [saveDataLocally]);

  const updateSettings = useCallback((income: number, username: string) => {
    setAppData((prevData) => {
      const newDailyBudget = calculateDailyBudget(income, prevData.expenses);
      const newData = {
        ...prevData,
        income,
        username,
        dailyBudget: newDailyBudget,
      };
      saveDataLocally(newData);
      return newData;
    });
  }, [calculateDailyBudget, saveDataLocally]);

  const handleAddTransaction = useCallback((amount: number) => {
    addTransaction(amount);
  }, [addTransaction]);

  return (
    <div className="app-container">
      <div className="app-content">
        <div className="h-full">
          {activeScreen === 'expenses' && (
            <ExpensesScreen
              expenses={appData.expenses}
              income={appData.income}
              addExpense={addExpense}
              removeExpense={removeExpense}
            />
          )}
          {activeScreen === 'home' && (
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
          )}
          {activeScreen === 'settings' && (
            <SettingsScreen
              income={appData.income}
              dailyBudget={appData.dailyBudget}
              updateSettings={updateSettings}
              totalExpenses={appData.expenses.reduce((sum, exp) => sum + exp.amount, 0)}
              username={appData.username}
            />
          )}
        </div>
      </div>

      <nav className="app-nav">
        <div className="max-w-md mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => setActiveScreen('expenses')}
              className={`nav-item ${activeScreen === 'expenses' ? 'active' : ''}`}
            >
              <DollarSign className="w-6 h-6" />
              <span className="text-xs mt-1">Expenses</span>
            </button>

            {activeScreen === 'home' ? (
              <button
                onClick={() => setShowAddTransaction(true)}
                className="nav-item-center"
              >
                <div className="nav-item-center-button">
                  <Plus className="w-6 h-6 text-white" />
                </div>
              </button>
            ) : (
              <button
                onClick={() => setActiveScreen('home')}
                className={`nav-item ${activeScreen === 'home' ? 'active' : ''}`}
              >
                <Home className="w-6 h-6" />
                <span className="text-xs mt-1">Home</span>
              </button>
            )}

            <button
              onClick={() => setActiveScreen('settings')}
              className={`nav-item ${activeScreen === 'settings' ? 'active' : ''}`}
            >
              <User className="w-6 h-6" />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {showAddTransaction && (
        <MoneyInput
          onClose={() => setShowAddTransaction(false)}
          onSubmit={handleAddTransaction}
        />
      )}
    </div>
  );
}

export default App;