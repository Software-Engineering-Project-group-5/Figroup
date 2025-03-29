import React from "react";
import { TrendingUpIcon, PlusIcon, BarChartIcon, PieChartIcon, DollarSignIcon } from "lucide-react";
export function Investments() {
  // Mock data for investments
  const investments = [
    {
      id: 1,
      name: "Vacation Fund",
      group: "Friends",
      target: 2000,
      current: 850,
      contributors: 4,
      lastContribution: "2025-08-12",
      image:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2h8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60",
    },
    {
      id: 2,
      name: "Group Investment",
      group: "Investment Club",
      target: 5000,
      current: 3200,
      contributors: 6,
      lastContribution: "2025-08-15",
      image:
        "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvY2tzfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60",
    },
    {
      id: 3,
      name: "Home Renovation",
      group: "Family",
      target: 10000,
      current: 2500,
      contributors: 5,
      lastContribution: "2023-08-10",
      image:
        "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG9tZSUyMHJlbm92YXRpb258ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=100&q=60",
    },
  ];
  // Mock data for portfolio summary
  const portfolioSummary = {
    totalInvested: 6550,
    totalContributions: [
      {
        month: "Jan",
        amount: 500,
      },
      {
        month: "Feb",
        amount: 750,
      },
      {
        month: "Mar",
        amount: 900,
      },
      {
        month: "Apr",
        amount: 1200,
      },
      {
        month: "May",
        amount: 1500,
      },
      {
        month: "Jun",
        amount: 1700,
      },
    ],
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your group investments</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <PlusIcon size={16} className="mr-2" />
          New Investment
        </button>
      </div>
      {/* Portfolio Summary */}
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
              ${portfolioSummary.totalInvested.toFixed(2)}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Across {investments.length} investment pools
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-900 mb-3">Contribution Growth</h3>
            <div className="h-32 flex items-end space-x-2">
              {portfolioSummary.totalContributions.map((month, index) => {
                const height = (month.amount / 2000) * 100;
                return (
                  <div key={month.month} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full bg-blue-500 rounded-t-sm"
                      style={{
                        height: `${height}%`,
                      }}
                    ></div>
                    <span className="mt-1 text-xs text-gray-500">{month.month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {/* Investment Pools */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">Investment Pools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {investments.map((investment) => {
            const progress = (investment.current / investment.target) * 100;
            return (
              <div
                key={investment.id}
                className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="relative h-32 bg-gray-200">
                  <img
                    src={investment.image}
                    alt={investment.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-lg font-medium text-white">{investment.name}</h3>
                    <p className="text-sm text-white/80">{investment.group}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-900">
                      ${investment.current} raised
                    </span>
                    <span className="text-sm text-gray-500">of ${investment.target} goal</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${progress}%`,
                      }}
                    ></div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-500">
                      {investment.contributors} contributors
                    </div>
                    <div className="text-sm text-gray-500">
                      Last contribution: {investment.lastContribution}
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button className="bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-md text-sm font-medium">
                      Contribute
                    </button>
                    <button className="bg-gray-50 text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-md text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Add new investment card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden border-dashed">
            <button className="w-full h-full p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50">
              <div className="p-3 rounded-full bg-gray-100">
                <PlusIcon size={24} />
              </div>
              <p className="mt-3 text-sm font-medium">Create New Investment Pool</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
