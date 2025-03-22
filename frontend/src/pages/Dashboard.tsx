import React from "react";
import {
  DollarSignIcon,
  UserPlusIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  TrendingUpIcon,
  CalendarIcon,
  ArrowRightIcon,
  BellIcon,
  PlusIcon,
  UsersIcon,
  PiggyBankIcon,
} from "lucide-react";
export function Dashboard() {
  // Mock data
  const totalOwed = 245.75;
  const totalYouOwe = 120.5;
  const netBalance = totalOwed - totalYouOwe;
  const recentActivities = [
    {
      id: 1,
      type: "expense",
      description: "Grocery shopping",
      amount: 85.2,
      date: "2025-08-15",
      group: "Roommates",
      status: "settled",
      user: "John Doe",
      userImage:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    },
    {
      id: 2,
      type: "payment",
      description: "Dinner at Italian Restaurant",
      amount: 42.3,
      date: "2025-08-12",
      group: "Friends",
      status: "pending",
      user: "Sarah Smith",
      userImage:
        "https://images.unsplash.com/photo-1595295333158-4742f28fbd85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    },
    {
      id: 3,
      type: "expense",
      description: "Monthly Utilities",
      amount: 120.5,
      date: "2025-08-10",
      group: "Roommates",
      status: "pending",
      user: "Mike Johnson",
      userImage:
        "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300&q=80",
    },
  ];
  const quickStats = [
    {
      label: "Active Groups",
      value: "4",
      icon: <UsersIcon className="text-blue-600" />,
      bgColor: "bg-blue-50",
    },
    {
      label: "Total Expenses",
      value: "$1,234",
      icon: <DollarSignIcon className="text-green-600" />,
      bgColor: "bg-green-50",
    },
    {
      label: "Investments",
      value: "$6,550",
      icon: <PiggyBankIcon className="text-purple-600" />,
      bgColor: "bg-purple-50",
    },
  ];
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, Fred</h1>
          <p className="mt-1 text-sm text-gray-500">Here's what's happening with your expenses</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
            <PlusIcon size={16} className="mr-2" />
            New Expense
          </button>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat) => (
          <div key={stat.label} className={`${stat.bgColor} p-6 rounded-lg`}>
            <div className="flex items-center">
              <div className="p-2 bg-white rounded-lg">{stat.icon}</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Balance Overview</h2>
            <TrendingUpIcon className="text-blue-600" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-md">
                  <DollarSignIcon size={20} className="text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">You are owed</p>
                  <p className="text-xl font-semibold text-green-600">${totalOwed.toFixed(2)}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">From 3 people</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-md">
                  <DollarSignIcon size={20} className="text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">You owe</p>
                  <p className="text-xl font-semibold text-red-600">${totalYouOwe.toFixed(2)}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">To 2 people</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-md">
                  <DollarSignIcon size={20} className="text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Net balance</p>
                  <p
                    className={`text-xl font-semibold ${
                      netBalance >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    ${Math.abs(netBalance).toFixed(2)}
                  </p>
                </div>
              </div>
              <span className="text-sm text-gray-500">
                {netBalance >= 0 ? "Positive" : "Negative"}
              </span>
            </div>
          </div>
        </div>
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors">
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSignIcon size={24} className="text-blue-600" />
              </div>
              <span className="mt-4 text-sm font-medium text-gray-900">Add Expense</span>
              <span className="mt-1 text-xs text-gray-500">Split bills with others</span>
            </button>
            <button className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-colors">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSignIcon size={24} className="text-green-600" />
              </div>
              <span className="mt-4 text-sm font-medium text-gray-900">Settle Up</span>
              <span className="mt-1 text-xs text-gray-500">Clear pending balances</span>
            </button>
            <button className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-purple-50 hover:border-purple-200 transition-colors">
              <div className="p-3 bg-purple-100 rounded-full">
                <UserPlusIcon size={24} className="text-purple-600" />
              </div>
              <span className="mt-4 text-sm font-medium text-gray-900">Create Group</span>
              <span className="mt-1 text-xs text-gray-500">Start splitting expenses</span>
            </button>
            <button className="flex flex-col items-center p-6 border border-gray-200 rounded-lg hover:bg-yellow-50 hover:border-yellow-200 transition-colors">
              <div className="p-3 bg-yellow-100 rounded-full">
                <PiggyBankIcon size={24} className="text-yellow-600" />
              </div>
              <span className="mt-4 text-sm font-medium text-gray-900">Add Investment</span>
              <span className="mt-1 text-xs text-gray-500">Pool money together</span>
            </button>
          </div>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
            View all <ArrowRightIcon size={16} className="ml-1" />
          </button>
        </div>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={activity.userImage}
                  alt={activity.user}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-gray-500 flex items-center">
                      <UsersIcon size={12} className="mr-1" /> {activity.group}
                    </span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-xs text-gray-500 flex items-center">
                      <CalendarIcon size={12} className="mr-1" /> {activity.date}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`text-sm font-medium ${
                    activity.type === "payment" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  ${activity.amount.toFixed(2)}
                </span>
                {activity.status === "pending" ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <AlertCircleIcon size={12} className="mr-1" /> Pending
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    <CheckCircleIcon size={12} className="mr-1" /> Settled
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
