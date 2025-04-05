import React, { useState, useEffect } from 'react';
import { 
  XIcon, 
  TrendingUpIcon, 
  TrendingDownIcon,
  DollarSignIcon,
  PieChartIcon,
  CalendarIcon,
  UserIcon,
  ArrowUpRightIcon,
  ArrowDownRightIcon,
  UsersIcon,
  AlertCircleIcon
} from 'lucide-react';
import axios from 'axios';

interface Investment {
  _id: string;
  group_id: string;
  stock_symbol: string;
  total_invested: number;
  shares_bought: number;
  current_value: number;
  created_at: string;
}

interface Contribution {
  _id: string;
  user_id: string;
  amount: number;
  created_at: string;
}

interface Member {
  _id: string;
  name: string;
  email: string;
}

interface InvestmentDetails {
  investment: Investment;
  current_market_price: string;
}

interface InvestmentPopupProps {
  investmentId: string;
  onClose: () => void;
}

export function InvestmentPopup({ investmentId, onClose }: InvestmentPopupProps) {
  const [investment, setInvestment] = useState<Investment | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Authentication required');

        // Fetch investment details
        const investmentRes = await axios.get<InvestmentDetails>(
          `https://figroup.onrender.com/api/investments/${investmentId}`,
          { headers: { 'x-auth-token': token } }
        );
        setInvestment(investmentRes.data.investment);
        setCurrentPrice(parseFloat(investmentRes.data.current_market_price));

        // Fetch contributions
        const contributionsRes = await axios.get<Contribution[]>(
          `https://figroup.onrender.com/api/contributions/${investmentId}/contributions`,
          { headers: { 'x-auth-token': token } }
        );
        setContributions(contributionsRes.data);

        // Fetch group members
        const groupRes = await axios.get<{ members: Member[] }>(
          `https://figroup.onrender.com/api/groups/${investmentRes.data.investment.group_id}`,
          { headers: { 'x-auth-token': token } }
        );
        setMembers(groupRes.data.members);

      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [investmentId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getMemberName = (userId: string) => {
    const member = members.find(m => m._id === userId);
    return member ? `${member.name}${userId === currentUserId ? ' (You)' : ''}` : 'Unknown';
  };

  const calculatePerformance = () => {
    if (!investment) return { 
      purchasePricePerShare: 0,
      currentPricePerShare: 0,
      change: 0, 
      percentage: 0, 
      isPositive: false 
    };

    const purchasePricePerShare = investment.total_invested / investment.shares_bought;
    const totalCurrentValue = currentPrice * investment.shares_bought;
    const changePerShare = totalCurrentValue - investment.total_invested;
    const percentageChange = (changePerShare / investment.total_invested) * 100;
    
    const currentPricePerShare = currentPrice;
    
    return {
      purchasePricePerShare,
      currentPricePerShare,
      change: changePerShare * investment.shares_bought,
      percentage: percentageChange,
      isPositive: changePerShare >= 0
    };
  };

  const performance = calculatePerformance();
  const userContribution = contributions.find(c => c.user_id === currentUserId)?.amount || 0;

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <div className="flex items-center text-red-500">
            <AlertCircleIcon className="mr-2" />
            <p>{error}</p>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Investment Details</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stock Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {investment?.stock_symbol}
              </h3>
              <p className="text-sm text-gray-500">
                {investment?.shares_bought.toFixed(4)} shares
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(currentPrice)}
              </p>
              <div className={`inline-flex items-center text-sm font-medium ${
                performance.isPositive ? 'text-green-600' : performance.percentage === 0 ? 'text-gray-600' : 'text-red-600'
              }`}>
                {performance.percentage > 0 ? (
                  <ArrowUpRightIcon size={16} className="mr-1" />
                ) : performance.percentage < 0 ? (
                  <ArrowDownRightIcon size={16} className="mr-1" />
                ) : null}
                {performance.percentage === 0 ? 'No change' : `${Math.abs(performance.percentage).toFixed(2)}%`}
              </div>
            </div>
          </div>

          {/* Price Comparison */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-600">Purchase Price</p>
              <p className="text-lg font-bold text-blue-700">
                {formatCurrency(performance.purchasePricePerShare)}/share
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-3">
              <p className="text-sm text-green-600">Current Price</p>
              <p className="text-lg font-bold text-green-700">
                {formatCurrency(performance.currentPricePerShare)}/share
              </p>
            </div>
          </div>

          {/* Performance Summary */}
          <div className={`rounded-lg p-4 ${
            performance.isPositive ? 'bg-green-50' : performance.percentage === 0 ? 'bg-gray-50' : 'bg-red-50'
          }`}>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Performance</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Total Invested</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(investment?.total_invested || 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Value</p>
                <p className={`text-lg font-bold ${
                  performance.isPositive ? 'text-green-600' : performance.percentage === 0 ? 'text-gray-600' : 'text-red-600'
                }`}>
                  {formatCurrency(currentPrice * (investment?.shares_bought || 0))}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gain/Loss</p>
                <p className={`text-lg font-bold ${
                  performance.isPositive ? 'text-green-600' : performance.percentage === 0 ? 'text-gray-600' : 'text-red-600'
                }`}>
                  {performance.change >= 0 ? '+' : ''}
                  {formatCurrency(performance.change)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Percentage</p>
                <p className={`text-lg font-bold ${
                  performance.isPositive ? 'text-green-600' : performance.percentage === 0 ? 'text-gray-600' : 'text-red-600'
                }`}>
                  {performance.percentage >= 0 ? '+' : ''}
                  {performance.percentage.toFixed(2)}%
                </p>
              </div>
            </div>
          </div>

          {/* Your Contribution */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Your Contribution</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-gray-900">
                  {formatCurrency(userContribution)}
                </p>
                <p className="text-sm text-gray-500">
                  {investment ? `${((userContribution / investment.total_invested) * 100).toFixed(2)}% of total` : 'Calculating...'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Value</p>
                <p className="text-lg font-bold text-gray-900">
                  {investment ? formatCurrency((userContribution / investment.total_invested) * currentPrice * investment.shares_bought) : 'Calculating...'}
                </p>
              </div>
            </div>
          </div>

          {/* Contribution Breakdown */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <UsersIcon size={16} className="mr-2" />
              Member Contributions
            </h4>
            <div className="space-y-3">
              {contributions.map(contribution => (
                <div key={contribution._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <UserIcon size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {getMemberName(contribution.user_id)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(contribution.created_at)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {formatCurrency(contribution.amount)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Investment Details */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-gray-500">Investment Details</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-500">
                <CalendarIcon size={16} className="mr-2" />
                <span>Investment Date</span>
              </div>
              <span className="font-medium text-gray-900">
                {formatDate(investment?.created_at || '')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white p-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}