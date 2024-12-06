import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { Transaction } from '../types';

interface DevModeMenuProps {
  transactions: Transaction[];
  removeTransaction: (index: number) => void;
  setCurrentDate: (date: Date) => void;
  currentDate: Date;
}

const DevModeMenu: React.FC<DevModeMenuProps> = ({
  transactions,
  removeTransaction,
  setCurrentDate,
  currentDate,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    // Set time to noon to avoid timezone issues
    newDate.setHours(12, 0, 0, 0);
    setCurrentDate(newDate);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gray-800 text-white p-2 rounded-full shadow-lg inline-block"
        aria-label="Open Developer Menu"
      >
        <Settings className="w-5 h-5" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Dev Mode Menu</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="virtualDate" className="block text-sm font-medium text-gray-300 mb-1">
                  Virtual Date
                </label>
                <input
                  type="date"
                  id="virtualDate"
                  value={currentDate.toISOString().split('T')[0]}
                  onChange={handleDateChange}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg"
                />
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Recent Transactions</h4>
                <div className="space-y-2">
                  {transactions.slice(-5).map((transaction, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                      <span className="text-white">£{transaction.amount.toFixed(2)}</span>
                      <button
                        onClick={() => removeTransaction(transactions.length - 5 + index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DevModeMenu;