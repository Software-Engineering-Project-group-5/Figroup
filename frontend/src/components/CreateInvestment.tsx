import React, { useState, useEffect } from 'react';
import { XIcon, PlusIcon, SearchIcon, TrendingUpIcon, DollarSignIcon } from 'lucide-react';
import axios from 'axios';

interface Stock {
  name: string;
  symbol: string;
}

interface CreateInvestmentPopupProps {
  groupId: string | undefined;
  onClose: () => void;
  onInvestmentCreated: () => void;
}

export function CreateInvestmentPopup({ groupId, onClose, onInvestmentCreated }: CreateInvestmentPopupProps) {
  const [totalAmount, setTotalAmount] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get<{ stocks: Record<string, string> }>(
          'https://figroup.onrender.com/api/stocks/',
          { headers: { 'x-auth-token': token } }
        );

        const stockList = Object.entries(response.data.stocks).map(([name, symbol]) => ({
          name,
          symbol
        }));
        setStocks(stockList);
      } catch (err) {
        console.error('Failed to fetch stocks:', err);
        setError('Failed to load stock symbols');
      }
    };

    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter(stock =>
    stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!selectedStock || !totalAmount) {
      setError('Please fill all fields');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.post(
        'https://figroup.onrender.com/api/investments/',
        {
          group_id: groupId,
          total_amount: parseFloat(totalAmount),
          stock_symbol: selectedStock.symbol
        },
        { headers: { 'x-auth-token': token } }
      );

      onInvestmentCreated();
      onClose();
    } catch (err) {
      console.error('Failed to create investment:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">New Investment</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={loading}
          >
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

          {/* Stock Selection Dropdown */}
          <div className="relative">
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock
            </label>
            <div className="relative">
              <div 
                className="flex items-center justify-between p-2 border border-gray-300 rounded-md cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {selectedStock ? (
                  <div className="flex items-center">
                    <TrendingUpIcon className="h-5 w-5 text-blue-500 mr-2" />
                    <span>
                      {selectedStock.name} ({selectedStock.symbol})
                    </span>
                  </div>
                ) : (
                  <span className="text-gray-400">Select a stock</span>
                )}
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform ${
                    isDropdownOpen ? 'transform rotate-180' : ''
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 max-h-60 overflow-auto">
                  <div className="px-2 py-1 sticky top-0 bg-white border-b">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Search stocks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        autoFocus
                      />
                    </div>
                  </div>
                  {filteredStocks.length > 0 ? (
                    filteredStocks.map((stock) => (
                      <div
                        key={stock.symbol}
                        className="px-4 py-2 hover:bg-blue-50 cursor-pointer flex items-center"
                        onClick={() => {
                          setSelectedStock(stock);
                          setSearchTerm('');
                          setIsDropdownOpen(false);
                        }}
                      >
                        <TrendingUpIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <div className="font-medium text-gray-900">{stock.name}</div>
                          <div className="text-sm text-gray-500">{stock.symbol}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500">No stocks found</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Total Amount
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
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-2 border-gray-300 rounded-md"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedStock || !totalAmount}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Investment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}