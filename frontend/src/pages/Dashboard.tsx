import React, { useEffect, useState } from "react";
import {
  DollarSignIcon,
  UserPlusIcon,
  UsersIcon,
  PlusIcon,
  ArrowRightIcon,
  CalendarIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";

interface BalanceDetail {
  user_id: string;
  amount: number;
}

interface GroupBalance {
  group_id: string;
  group_name: string;
  total_owed: number;
  total_to_receive: number;
  owes_to: BalanceDetail[];
  gets_from: BalanceDetail[];
}

interface UserSummary {
  groupBalances: GroupBalance[];
  name: string;
}

interface Expense {
  _id: string;
  group_id: string;
  payer_id: string;
  amount: number;
  description: string;
  split_type: 'EQUAL' | 'CUSTOM';
  split_details: Record<string, number>;
  created_at: string;
}

export function Dashboard() {
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [loading, setLoading] = useState({
    summary: true,
    expenses: true
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          throw new Error('Authentication required');
        }

        const response = await axios.get(
          `https://figroup.onrender.com/api/users/${userId}/summary`,
          { headers: { 'x-auth-token': token } }
        );

        setSummary(response.data);
        if (response.data.groupBalances.length > 0) {
          setSelectedGroupId(response.data.groupBalances[0].group_id);
        }
      } catch (err) {
        console.error('Failed to fetch user summary:', err);
        setError('Failed to load dashboard data');
      } finally {
        setLoading(prev => ({ ...prev, summary: false }));
      }
    };

    fetchUserSummary();
  }, []);

  useEffect(() => {
    if (!selectedGroupId) return;

    const fetchGroupExpenses = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `https://figroup.onrender.com/api/expenses/groups/${selectedGroupId}/expenses`,
          { headers: { 'x-auth-token': token } }
        );
        
        const sortedExpenses = response.data
          .sort((a: Expense, b: Expense) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          .slice(0, 3);
          
        setRecentExpenses(sortedExpenses);
      } catch (err) {
        console.error('Failed to fetch group expenses:', err);
      } finally {
        setLoading(prev => ({ ...prev, expenses: false }));
      }
    };

    fetchGroupExpenses();
  }, [selectedGroupId]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return 'Date not available';
    }
  };

  const totalOwed = summary?.groupBalances.reduce((sum, group) => sum + group.total_owed, 0) || 0;
  const totalToReceive = summary?.groupBalances.reduce((sum, group) => sum + group.total_to_receive, 0) || 0;
  const netBalance = totalToReceive - totalOwed;

  if (loading.summary) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {summary?.name || 'User'}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {netBalance >= 0 ? (
              <span className="text-green-600">You're owed ${netBalance.toFixed(2)} in total</span>
            ) : (
              <span className="text-red-600">You owe ${Math.abs(netBalance).toFixed(2)} in total</span>
            )}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link 
            to="/groups" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon size={16} className="mr-2" />
            New Expense
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-white rounded-lg">
              <UsersIcon className="text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Groups</p>
              <p className="text-2xl font-semibold text-gray-900">
                {summary?.groupBalances.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-white rounded-lg">
              <DollarSignIcon className="text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">You are owed</p>
              <p className="text-2xl font-semibold text-green-600">
                ${totalToReceive.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 p-6 rounded-lg">
          <div className="flex items-center">
            <div className="p-2 bg-white rounded-lg">
              <DollarSignIcon className="text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">You owe</p>
              <p className="text-2xl font-semibold text-red-600">
                ${totalOwed.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link 
            to="/groups" 
            className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
          >
            <div className="p-3 bg-blue-100 rounded-full">
              <PlusIcon size={24} className="text-blue-600" />
            </div>
            <span className="mt-4 text-sm font-medium text-gray-900">Add Expense</span>
            <span className="mt-1 text-xs text-gray-500">Split bills with others</span>
          </Link>
          <Link 
            to="/groups" 
            className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors"
          >
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSignIcon size={24} className="text-green-600" />
            </div>
            <span className="mt-4 text-sm font-medium text-gray-900">Settle Up</span>
            <span className="mt-1 text-xs text-gray-500">Clear pending balances</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          {selectedGroupId && (
            <Link 
              to={`/groups/${selectedGroupId}/expenses`}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View all <ArrowRightIcon size={16} className="ml-1" />
            </Link>
          )}
        </div>
        
        {loading.expenses ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : recentExpenses.length > 0 ? (
          <div className="space-y-4">
            {recentExpenses.map((expense) => (
              <div key={expense._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <DollarSignIcon size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500 flex items-center">
                        <CalendarIcon size={12} className="mr-1" /> 
                        {formatDate(expense.created_at)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-green-600">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    expense.split_type === 'EQUAL' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                  }`}>
                    {expense.split_type === 'EQUAL' ? 'Equal' : 'Custom'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-4">No recent expenses found</p>
        )}
      </div>
    </div>
  );
}