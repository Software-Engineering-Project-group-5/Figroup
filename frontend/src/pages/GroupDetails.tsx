import React, { useEffect, useState } from "react";
import { 
  UsersIcon, 
  PlusIcon, 
  ArrowLeftIcon,
  DollarSignIcon,
  UserIcon,
  CalendarIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  ArrowRightIcon
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CreateExpensePopup } from "../components/Expense";
import { AddMemberPopup } from "../components/AddMember";

interface Member {
  _id: string;
  name: string;
  email: string;
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

interface Group {
  _id: string;
  name: string;
  type: string;
  admin_id: string;
  members: Member[];
  expenses: Expense[];
  created_at: string;
}

interface Balance {
  user_id: string;
  amount: number;
}

interface GroupSummary {
  group_id: string;
  group_name: string;
  total_owed: number;
  total_to_receive: number;
  owes_to: Balance[];
  gets_from: Balance[];
}

interface UserSummaryResponse {
    groupBalances: GroupSummary[];
    name: string;
}

export function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [summary, setSummary] = useState<GroupSummary | null>(null);
  const [loading, setLoading] = useState({
    group: true,
    summary: true
  });
  const [error, setError] = useState("");
  const [showCreateExpense, setShowCreateExpense] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const currentUserId = localStorage.getItem('userId');

  const refreshExpenses = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `https://figroup.onrender.com/api/groups/${groupId}`,
      { headers: { 'x-auth-token': token } }
    );
    setGroup(response.data);

    const summaryResponse = await axios.get<UserSummaryResponse>(
        `https://figroup.onrender.com/api/users/${currentUserId}/summary`,
        { headers: { 'x-auth-token': token } }
      );
    
    const groupSummary = summaryResponse.data.groupBalances.find(
      (g: any) => g.group_id === groupId
    );
    setSummary(groupSummary || null);
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token || !groupId) {
          throw new Error('Authentication required');
        }

        // Fetch group details
        const groupResponse = await axios.get<Group>(
          `https://figroup.onrender.com/api/groups/${groupId}`,
          { headers: { 'x-auth-token': token } }
        );
        setGroup(groupResponse.data);

        // Fetch group summary
        const summaryResponse = await axios.get<UserSummaryResponse>(
            `https://figroup.onrender.com/api/users/${currentUserId}/summary`,
            { headers: { 'x-auth-token': token } }
          );
        
        // Find the summary for this specific group
        const groupSummary = summaryResponse.data.groupBalances.find(
          (g: any) => g.group_id === groupId
        );
        setSummary(groupSummary || null);

      } catch (err) {
        console.error('Failed to fetch group data:', err);
        setError('Failed to load group data');
      } finally {
        setLoading({ group: false, summary: false });
      }
    };

    fetchGroupData();
  }, [groupId, currentUserId]);

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

  const getMemberName = (userId: string) => {
    if (userId === currentUserId) return 'You';
    const member = group?.members.find(m => m._id === userId);
    return member?.name || 'Unknown';
  };

  if (loading.group || loading.summary) {
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

  if (!group) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-sm text-yellow-700">Group not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon size={20} className="mr-2" />
          Back to Groups
        </button>
        <button 
            onClick={() => setShowAddMember(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
            <PlusIcon size={16} className="mr-2" />
            Add Member
        </button>
      </div>

      {showAddMember && (
        <AddMemberPopup
            groupId={groupId}
            onClose={() => setShowAddMember(false)}
            onMemberAdded={refreshExpenses}
        />
      )}

      {/* Group Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Created on {formatDate(group.created_at)} • {group.members.length} members
            </p>
          </div>
          <div className="flex -space-x-2">
            {group.members.slice(0, 5).map(member => (
              <div 
                key={member._id}
                className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center"
              >
                <UserIcon size={16} className="text-blue-600" />
              </div>
            ))}
            {group.members.length > 5 && (
              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium">
                +{group.members.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Balance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* You Owe */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            <span className="text-red-600">You owe</span> ${summary?.total_owed.toFixed(2) || '0.00'}
          </h2>
          {summary?.owes_to.length ? (
            <ul className="space-y-3">
              {summary.owes_to.map(balance => (
                <li key={balance.user_id} className="flex justify-between items-center">
                  <span className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {getMemberName(balance.user_id)}
                  </span>
                  <span className="font-medium text-red-600">
                    ${balance.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No balances owed</p>
          )}
        </div>

        {/* You Are Owed */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            <span className="text-green-600">You are owed</span> ${summary?.total_to_receive.toFixed(2) || '0.00'}
          </h2>
          {summary?.gets_from.length ? (
            <ul className="space-y-3">
              {summary.gets_from.map(balance => (
                <li key={balance.user_id} className="flex justify-between items-center">
                  <span className="flex items-center">
                    <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                    {getMemberName(balance.user_id)}
                  </span>
                  <span className="font-medium text-green-600">
                    ${balance.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No balances to receive</p>
          )}
        </div>
      </div>

        {/* Expenses Section - Render ALL expenses */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">All Expenses</h2>
            <button 
                onClick={() => setShowCreateExpense(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                <PlusIcon size={16} className="mr-2" />
                Add Expense
            </button>
        </div>

        {showCreateExpense && (
            <CreateExpensePopup
                groupId={groupId}
                onClose={() => setShowCreateExpense(false)}
                onExpenseCreated={refreshExpenses}
            />
        )}
        
        {group.expenses.length ? (
            <div className="space-y-4">
            {group.expenses
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map(expense => (
                <div key={expense._id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-full ${
                        expense.payer_id === currentUserId ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                        <DollarSignIcon size={20} className={
                        expense.payer_id === currentUserId ? 'text-green-600' : 'text-gray-600'
                        } />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">{expense.description}</p>
                        <div className="flex items-center mt-1">
                        <span className="text-xs text-gray-500 flex items-center">
                            {expense.payer_id === currentUserId ? (
                            <span className="text-green-600">You paid</span>
                            ) : (
                            <span className="text-red-600">{getMemberName(expense.payer_id)} paid</span>
                            )}
                        </span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-xs text-gray-500 flex items-center">
                            <CalendarIcon size={12} className="mr-1" /> 
                            {formatDate(expense.created_at)}
                        </span>
                        </div>
                    </div>
                    </div>
                    <div className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-900">
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
          <div className="py-8 text-center">
            <p className="text-gray-500">No expenses yet</p>
            <Link
              to={`/groups/${groupId}/expenses/new`}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon size={16} className="mr-2" />
              Add your first expense
            </Link>
          </div>
        )}
      </div>

      {/* Settle Up Button */}
      {(summary?.total_owed || summary?.total_to_receive) && (
        <div className="flex justify-center">
          <Link
            to={`/groups/${groupId}/settle`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <TrendingUpIcon size={20} className="mr-2" />
            Settle Up Balances
          </Link>
        </div>
      )}
    </div>
  );
}