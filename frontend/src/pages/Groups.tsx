import React, { useEffect, useState } from "react";
import { UsersIcon, PlusIcon, MoreVerticalIcon, AlertCircleIcon } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CreateGroupPopup } from "../components/CreateGroup";

interface Member {
  _id: string;
  name: string;
  email: string;
}

interface Expense {
  _id: string;
  amount: number;
  description: string;
  created_at: string;
}

interface Group {
  _id: string;
  name: string;
  type: string;
  admin_id: string;
  members: Member[];
  expenses: Expense[];
  created_at: string;
}

interface UserSummary {
  groupBalances: {
    group_id: string;
    group_name: string;
    total_owed: number;
    total_to_receive: number;
  }[];
  name: string;
}

export function Groups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (!token || !userId) {
          throw new Error('Authentication required');
        }

        // Fetch user summary to get group IDs
        const summaryResponse = await axios.get<UserSummary>(
          `http://localhost:5001/api/users/${userId}/summary`,
          { headers: { 'x-auth-token': token } }
        );

        // Fetch details for each group
        const groupPromises = summaryResponse.data.groupBalances.map(async (groupBalance) => {
          const groupResponse = await axios.get<Group>(
            `http://localhost:5001/api/groups/${groupBalance.group_id}`,
            { headers: { 'x-auth-token': token } }
          );
          return groupResponse.data;
        });

        const fetchedGroups = await Promise.all(groupPromises);
        setGroups(fetchedGroups);

        // Create balance mapping
        const balanceMap = summaryResponse.data.groupBalances.reduce((acc, group) => {
          acc[group.group_id] = group.total_to_receive - group.total_owed;
          return acc;
        }, {} as Record<string, number>);
        setBalances(balanceMap);

      } catch (err) {
        console.error('Failed to fetch groups:', err);
        setError('Failed to load groups data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const getLastActivity = (group: Group) => {
    if (group.expenses.length === 0) return 'No activity';
    const lastExpense = group.expenses.reduce((latest, expense) => 
      new Date(expense.created_at) > new Date(latest.created_at) ? expense : latest
    );
    return formatDate(lastExpense.created_at);
  };

  if (loading) {
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
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your expense groups</p>
        </div>
        <button
            onClick={() => setShowCreateGroup(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon size={16} className="mr-2" />
            New Group
        </button>
      </div>

      {showCreateGroup && (
        <CreateGroupPopup
          onClose={() => setShowCreateGroup(false)}
          type="EXPENSE"
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => {
        const balance = balances[group._id] || 0;
        return (
          <div
            key={group._id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group cursor-pointer"
          >
            {/* Make the main content area clickable */}
            <Link 
              to={`/groups/${group._id}`}
              className="block p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <UsersIcon size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {group.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-500"
                  onClick={(e) => e.preventDefault()} // Prevent link navigation
                >
                  <MoreVerticalIcon size={20} />
                </button>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Your balance</p>
                  <p
                    className={`text-lg font-medium ${
                      balance > 0
                        ? "text-green-600"
                        : balance < 0
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {balance > 0
                      ? `+$${balance.toFixed(2)}`
                      : balance < 0
                      ? `-$${Math.abs(balance).toFixed(2)}`
                      : "$0.00"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last activity</p>
                  <p className="text-sm font-medium text-gray-900">
                    {getLastActivity(group)}
                  </p>
                </div>
              </div>
            </Link>
            
            {/* Keep buttons separate so they don't trigger the main link */}
            <div className="mt-6 flex space-x-3 px-6 pb-6">
              <Link
                to={`/groups/${group._id}`}
                className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-md text-sm font-medium text-center"
              >
                Add Expense
              </Link>
              <Link
                to={`/groups/${group._id}/settle`}
                className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-md text-sm font-medium text-center"
              >
                Settle Up
              </Link>
            </div>
          </div>
        );
      })}
        
        {/* Add new group card */}
        <button
          onClick={() => setShowCreateGroup(true)}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden border-dashed hover:bg-blue-50 hover:border-blue-200 transition-colors w-full h-full"
        >
          <div className="w-full h-full p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600">
            <div className="p-3 rounded-full bg-gray-100">
              <PlusIcon size={24} />
            </div>
            <p className="mt-3 text-sm font-medium">Create New Group</p>
          </div>
        </button>
      </div>
    </div>
  );
}