import React, { useState } from 'react';
import { DollarSignIcon, XIcon, UsersIcon } from 'lucide-react';
import axios from 'axios';

interface CreateExpensePopupProps {
  groupId: string | undefined;
  onClose: () => void;
  onExpenseCreated: () => void;
}

export function CreateExpensePopup({ groupId, onClose, onExpenseCreated }: CreateExpensePopupProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [splitType, setSplitType] = useState<'EQUAL' | 'CUSTOM'>('EQUAL');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentUserId = localStorage.getItem('userId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token || !currentUserId) {
        throw new Error('Authentication required');
      }

      await axios.post(
        'http://localhost:5001/api/expenses/',
        {
          group_id: groupId,
          payer_id: currentUserId,
          amount: parseFloat(amount),
          description,
          split_type: splitType
        },
        { headers: { 'x-auth-token': token } }
      );

      onExpenseCreated(); // Refresh parent component
      onClose(); // Close popup
    } catch (err) {
      console.error('Failed to create expense:', err);
      setError('Failed to create expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Add New Expense</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <XIcon size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSignIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="amount"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="What was this for?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Split Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSplitType('EQUAL')}
                className={`flex items-center justify-center p-3 rounded-md border ${
                  splitType === 'EQUAL' 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UsersIcon className="mr-2 h-5 w-5" />
                Equal
              </button>
              <button
                type="button"
                onClick={() => setSplitType('CUSTOM')}
                className={`flex items-center justify-center p-3 rounded-md border ${
                  splitType === 'CUSTOM' 
                    ? 'border-purple-500 bg-purple-50 text-purple-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <DollarSignIcon className="mr-2 h-5 w-5" />
                Custom
              </button>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}