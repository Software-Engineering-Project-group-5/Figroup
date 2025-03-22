import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, UsersIcon, TrendingUpIcon, LogOutIcon } from 'lucide-react';
export function Navigation() {
  const location = useLocation();
  const navItems = [{
    name: 'Dashboard',
    path: '/dashboard',
    icon: <HomeIcon size={20} />
  }, {
    name: 'Groups',
    path: '/groups',
    icon: <UsersIcon size={20} />
  }, {
    name: 'Investments',
    path: '/investments',
    icon: <TrendingUpIcon size={20} />
  }];
  return <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-md">
              <TrendingUpIcon size={20} />
            </div>
            <span className="font-bold text-xl text-gray-800">FairShare</span>
          </Link>
          <div className="hidden md:flex space-x-8">
            {navItems.map(item => <Link key={item.path} to={item.path} className={`flex items-center space-x-1 px-3 py-2 rounded-md ${location.pathname === item.path ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:text-blue-600'}`}>
                {item.icon}
                <span>{item.name}</span>
              </Link>)}
            <Link to="/login" className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-blue-600">
              <LogOutIcon size={20} />
              <span>Logout</span>
            </Link>
          </div>
          <div className="md:hidden">
            {/* Mobile menu button would go here */}
            <button className="p-2 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {/* Mobile navigation - example */}
      <div className="md:hidden border-t border-gray-200">
        <div className="flex justify-around py-2">
          {navItems.map(item => <Link key={item.path} to={item.path} className={`flex flex-col items-center p-2 ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-600'}`}>
              {item.icon}
              <span className="text-xs mt-1">{item.name}</span>
            </Link>)}
        </div>
      </div>
    </nav>;
}