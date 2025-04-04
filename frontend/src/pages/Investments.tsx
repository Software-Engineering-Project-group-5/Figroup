import React, { useEffect, useState } from "react";
import { 
  TrendingUpIcon, 
  PlusIcon, 
  BarChartIcon, 
  PieChartIcon, 
  DollarSignIcon,
  UsersIcon,
  ArrowRightIcon,
  AlertCircleIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CreateGroupPopup } from "../components/CreateGroup";

interface GroupContribution {
  group_id: string;
  group_name: string;
  total_group_investment: number;
  user_contribution: number;
}

interface UserInvestmentSummary {
  user_id: string;
  name: string;
  groupContributions: GroupContribution[];
}

interface Group {
  _id: string;
  name: string;
  type: string;
  members: Array<{
    _id: string;
    name: string;
    email: string;
  }>;
  investments: Array<{
    _id: string;
    stock_symbol: string;
    total_invested: number;
    shares_bought: number;
    current_value: number;
    created_at: string;
  }>;
  created_at: string;
}

export function Investments() {
  const [summary, setSummary] = useState<UserInvestmentSummary | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
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

        // Fetch user investment summary
        const summaryResponse = await axios.get<UserInvestmentSummary>(
          `http://localhost:5001/api/users/${userId}/investments/summary`,
          { headers: { 'x-auth-token': token } }
        );
        setSummary(summaryResponse.data);

        // Fetch details for each investment group
        const groupPromises = summaryResponse.data.groupContributions.map(async (group) => {
          const groupResponse = await axios.get<Group>(
            `http://localhost:5001/api/groups/${group.group_id}`,
            { headers: { 'x-auth-token': token } }
          );
          return groupResponse.data;
        });

        const fetchedGroups = await Promise.all(groupPromises);
        setGroups(fetchedGroups);

      } catch (err) {
        console.error('Failed to fetch investments:', err);
        setError('Failed to load investment data');
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
    if (group.investments.length === 0) return 'No activity';
    const lastInvestment = group.investments.reduce((latest, investment) => 
      new Date(investment.created_at) > new Date(latest.created_at) ? investment : latest
    );
    return formatDate(lastInvestment.created_at);
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
          <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your group investments</p>
        </div>
      </div>


      {showCreateGroup && (
        <CreateGroupPopup
          onClose={() => setShowCreateGroup(false)}
          type="INVESTMENT"
        />
      )}

      {/* Portfolio Summary */}
      {summary && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Portfolio Summary</h2>
            <div className="flex space-x-2">
              <button className="p-2 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200">
                <BarChartIcon size={18} />
              </button>
              <button className="p-2 bg-gray-100 rounded-md text-gray-600 hover:bg-gray-200">
                <PieChartIcon size={18} />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-md">
                  <DollarSignIcon size={20} className="text-green-600" />
                </div>
                <h3 className="ml-3 text-base font-medium text-gray-900">Total Invested</h3>
              </div>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ${summary.groupContributions.reduce((total, group) => total + group.user_contribution, 0).toFixed(2)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Across {summary.groupContributions.length} investment groups
              </p>
            </div>
            <div>
  <h3 className="text-base font-medium text-gray-900 mb-3">Group Investments</h3>
  
  {summary.groupContributions.length > 0 ? (
  <div className="flex items-end space-x-4 overflow-x-auto py-2">
    {/* Calculate max investment once before rendering */}
    {(() => {
      const maxInvestment = Math.max(
        1000, // Minimum max value to ensure small investments are visible
        ...summary.groupContributions.map((g) => g.total_group_investment)
      );

      return summary.groupContributions.map((group) => {
        // Total height represents the group's total investment relative to the max
        const totalHeight = Math.min(
          (group.total_group_investment / maxInvestment) * 100,
          100 // Cap at 100% height
        );

        // User's portion is calculated as a percentage of the totalHeight
        const userPercentage = group.total_group_investment > 0 
          ? (group.user_contribution / group.total_group_investment) * 100 
          : 0;

        return (
          <div key={group.group_id} className="flex-1 flex flex-col items-center min-w-[60px]">
            <div className="relative h-36 w-8 flex flex-col justify-end">
              {/* Total group investment (full height) */}
              <div 
                className="w-full bg-blue-100 rounded-t-md relative" 
                style={{ height: `${totalHeight}%` }}
              >
                {/* User's portion (calculated as percentage of total) */}
                <div
                  className="absolute bottom-0 left-0 right-0 bg-blue-600 rounded-t-md"
                  style={{ height: `${userPercentage}%` }}
                ></div>
              </div>

              {/* Value labels */}
              <div className="mt-1 text-center">
                <p className="text-xs font-medium text-gray-900">
                  ${group.total_group_investment.toLocaleString()}
                </p>
                <p className="text-xs text-blue-700">
                  ${group.user_contribution.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Group name and percentage */}
            <div className="mt-2 text-center">
              <p className="text-xs font-medium text-gray-900 line-clamp-1">
                {group.group_name}
              </p>
              <p className="text-xs text-gray-500">
                {userPercentage.toFixed(0)}% yours
              </p>
            </div>
          </div>
        );
      });
    })()}
  </div>
) : (
  <p className="text-sm text-gray-500">No contributions available.</p>
)}

</div>

          </div>
        </div>
      )}

      {/* Investment Groups */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Investment Groups</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => {
            const groupContribution = summary?.groupContributions.find(
              g => g.group_id === group._id
            );
            const progress = groupContribution 
              ? (groupContribution.user_contribution / groupContribution.total_group_investment) * 100 
              : 0;

            return (
              <div
                key={group._id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden group cursor-pointer"
              >
                <Link 
                  to={`/investments/${group._id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <TrendingUpIcon size={20} className="text-blue-600" />
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
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">Your contribution</p>
                        <p className="text-lg font-medium text-gray-900">
                          ${groupContribution?.user_contribution.toFixed(2) || '0.00'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Last activity</p>
                        <p className="text-sm font-medium text-gray-900">
                          {getLastActivity(group)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          Group total: ${groupContribution?.total_group_investment.toFixed(2) || '0.00'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {progress.toFixed(0)}% of your share
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${progress}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to={`/investments/${group._id}`}
                      className="bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-md text-sm font-medium text-center"
                    >
                      Invest More
                    </Link>
                    <Link
                      to={`/investments/${group._id}`}
                      className="bg-gray-50 text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-md text-sm font-medium text-center flex items-center justify-center"
                    >
                      View <ArrowRightIcon size={16} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Add new investment group card */}
          <Link
            onClick={() => setShowCreateGroup(true)}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden border-dashed hover:bg-blue-50 hover:border-blue-200 transition-colors" to={""}          >
            <div className="w-full h-full p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600">
              <div className="p-3 rounded-full bg-gray-100">
                <PlusIcon size={24} />
              </div>
              <p className="mt-3 text-sm font-medium">Create New Investment Group</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}