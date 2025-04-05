import React, { useEffect, useState } from "react";
import { 
  TrendingUpIcon, 
  PlusIcon, 
  UsersIcon,
  ArrowLeftIcon,
  DollarSignIcon,
  PieChartIcon,
  BarChart2Icon,
  UserIcon,
  CalendarIcon,
  AlertCircleIcon
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { InvestmentPopup } from "../components/Investment";
import { CreateInvestmentPopup } from "../components/CreateInvestment";
import { AddMemberPopup } from "../components/AddMember";

interface Member {
  _id: string;
  name: string;
  email: string;
}

interface Investment {
  _id: string;
  stock_symbol: string;
  total_invested: number;
  shares_bought: number;
  current_value: number;
  created_at: string;
}

interface Group {
  _id: string;
  name: string;
  type: string;
  admin_id: string;
  members: Member[];
  investments: Investment[];
  created_at: string;
}

interface UserContribution {
  group_id: string;
  group_name: string;
  total_group_investment: number;
  user_contribution: number;
}

export function GroupInvestments() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState<Group | null>(null);
  const [userContribution, setUserContribution] = useState<UserContribution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUserId = localStorage.getItem('userId');
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null);
  const [showCreateInvestment, setShowCreateInvestment] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token || !groupId || !currentUserId) {
          throw new Error('Authentication required');
        }

        // Fetch group details
        const groupResponse = await axios.get<Group>(
          `https://figroup.onrender.com/api/groups/${groupId}`,
          { headers: { 'x-auth-token': token } }
        );
        setGroup(groupResponse.data);

        // Fetch user's investment summary
        const summaryResponse = await axios.get<{ groupContributions: UserContribution[] }>(
          `https://figroup.onrender.com/api/users/${currentUserId}/investments/summary`,
          { headers: { 'x-auth-token': token } }
        );

        // Find this group's contribution data
        const contribution = summaryResponse.data.groupContributions.find(
          g => g.group_id === groupId
        );
        setUserContribution(contribution || null);

      } catch (err) {
        console.error('Failed to fetch group investments:', err);
        setError('Failed to load group investment data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId, currentUserId, refreshKey]);

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
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
          Back to Investments
        </button>
        <button onClick={() => setShowCreateInvestment(true)} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            Create New Investment
        </button>
      </div>

      {showCreateInvestment && (
    <CreateInvestmentPopup
        groupId={groupId}
        onClose={() => setShowCreateInvestment(false)}
        onInvestmentCreated={() => {
        // Refresh your investments list
        setShowCreateInvestment(false);
        setRefreshKey(prev => prev + 1);
        }}
    />
    )}

        {showAddMember && (
        <AddMemberPopup
            groupId={groupId}
            onClose={() => setShowAddMember(false)}
            onMemberAdded={() => setRefreshKey(prev => prev + 1)}
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

      {/* Investment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Group Investment */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md">
              <TrendingUpIcon size={20} className="text-blue-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-base font-medium text-gray-900">Total Group Investment</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatCurrency(userContribution?.total_group_investment || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Your Contribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md">
              <DollarSignIcon size={20} className="text-green-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-base font-medium text-gray-900">Your Contribution</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {formatCurrency(userContribution?.user_contribution || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Your Share */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-md">
              <PieChartIcon size={20} className="text-purple-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-base font-medium text-gray-900">Your Share</h3>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {userContribution && userContribution.total_group_investment > 0 ? 
                  `${((userContribution.user_contribution / userContribution.total_group_investment) * 100).toFixed(1)}%` : 
                  '0%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Investments */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Investments</h2>
          <div className="flex space-x-2">
            <button className="p-2 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200">
              <BarChart2Icon size={18} />
            </button>
            <button className="p-2 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200">
              <PieChartIcon size={18} />
            </button>
          </div>
        </div>

        {selectedInvestmentId && (
        <InvestmentPopup
            investmentId={selectedInvestmentId}
            onClose={() => setSelectedInvestmentId(null)}
        />
        )}

        {group.investments.length > 0 ? (
          <div className="space-y-4">
            {group.investments.slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((investment) => (
              <div 
              key={investment._id} 
              className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
              onClick={() => setSelectedInvestmentId(investment._id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {investment.stock_symbol}
                    </h3>
                    <div className="flex items-center mt-1 space-x-4">
                      <span className="text-sm text-gray-500 flex items-center">
                        <DollarSignIcon size={14} className="mr-1" />
                        {formatCurrency(investment.total_invested)}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <CalendarIcon size={14} className="mr-1" />
                        {formatDate(investment.created_at)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Shares</p>
                    <p className="text-lg font-medium text-gray-900">
                      {investment.shares_bought.toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No investments yet</p>
            <Link
              to={`/groups/${groupId}/invest`}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon size={16} className="mr-2" />
              Add your first investment
            </Link>
          </div>
        )}
      </div>

      {/* Members */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Members</h2>
            <button 
            onClick={() => setShowAddMember(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
            >
            <PlusIcon size={16} className="mr-2" />
            Add Member
            </button>
        </div>
        <div className="space-y-3">
          {group.members.map((member) => (
            <div key={member._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <UserIcon size={16} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {member.name}
                    {member._id === currentUserId && ' (You)'}
                  </h3>
                  <p className="text-xs text-gray-500">{member.email}</p>
                </div>
              </div>
              {member._id === group.admin_id && (
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  Admin
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}