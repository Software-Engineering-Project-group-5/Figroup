import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
export function MainLayout() {
  return <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>;
}