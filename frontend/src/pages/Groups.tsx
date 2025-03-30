import React from "react";
import { UsersIcon, PlusIcon, MoreVerticalIcon } from "lucide-react";
export function Groups() {
  // Mock data for groups
  const groups = [
    {
      id: 1,
      name: "Roommates",
      members: 4,
      balance: 125.25,
      lastActivity: "2025-08-15",
      image:
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXBhcnRtZW50fGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60",
    },
    {
      id: 2,
      name: "Weekend Trip",
      members: 6,
      balance: -42.3,
      lastActivity: "2025-08-12",
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhdmVsfGVufDB8fDB8fHww&auto=format&fit=crop&w=100&q=60",
    },
    {
      id: 3,
      name: "Family",
      members: 5,
      balance: 0,
      lastActivity: "2023-08-10",
      image:
        "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFtaWx5JTIwaG9tZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60",
    },
    {
      id: 4,
      name: "Lunch Group",
      members: 8,
      balance: 15.75,
      lastActivity: "2023-08-05",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zm9vZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=100&q=60",
    },
  ];
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Groups</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your expense groups</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <PlusIcon size={16} className="mr-2" />
          New Group
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {group.image ? (
                    <img
                      src={group.image}
                      alt={group.name}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <UsersIcon size={20} className="text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{group.name}</h3>
                    <p className="text-sm text-gray-500">{group.members} members</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <MoreVerticalIcon size={20} />
                </button>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-500">Your balance</p>
                  <p
                    className={`text-lg font-medium ${
                      group.balance > 0
                        ? "text-green-600"
                        : group.balance < 0
                        ? "text-red-600"
                        : "text-gray-900"
                    }`}
                  >
                    {group.balance > 0
                      ? `+$${group.balance.toFixed(2)}`
                      : group.balance < 0
                      ? `-$${Math.abs(group.balance).toFixed(2)}`
                      : "$0.00"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last activity</p>
                  <p className="text-sm font-medium text-gray-900">{group.lastActivity}</p>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 px-4 rounded-md text-sm font-medium">
                  Add Expense
                </button>
                <button className="flex-1 bg-gray-50 text-gray-600 hover:bg-gray-100 py-2 px-4 rounded-md text-sm font-medium">
                  Settle Up
                </button>
              </div>
            </div>
          </div>
        ))}
        {/* Add new group card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden border-dashed">
          <button className="w-full h-full p-6 flex flex-col items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50">
            <div className="p-3 rounded-full bg-gray-100">
              <PlusIcon size={24} />
            </div>
            <p className="mt-3 text-sm font-medium">Create New Group</p>
          </button>
        </div>
      </div>
    </div>
  );
}
