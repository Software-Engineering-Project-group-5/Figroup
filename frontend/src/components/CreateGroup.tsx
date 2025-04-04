import React, { useState } from 'react';
import { XIcon, UsersIcon, PlusIcon } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CreateGroupPopupProps {
  onClose: () => void;
  type: string
}

export function CreateGroupPopup({ onClose, type }: CreateGroupPopupProps,) {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem('userId');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token || !currentUserId) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        'http://localhost:5001/api/groups/',
        {
          name,
          type: type,
          admin_id: currentUserId
        },
        { headers: { 'x-auth-token': token } }
      );

      // Redirect to the newly created group
      if (response.data && response.data.group_id) {
        if(type == "EXPENSE") {
          navigate(`/groups/${response.data.group_id}`);
        }
        else {
          navigate(`/investments/${response.data.group_id}`);
        }
      } else {
        throw new Error('Group created but no ID returned');
      }
    } catch (err) {
      console.error('Failed to create group:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.msg || err.response?.data?.message || 'Failed to create group');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Create New Group</h2>
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
            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-start">
              <div className="flex-shrink-0">
                <XIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UsersIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-2 border-gray-300 rounded-md"
                placeholder="e.g. Roommates, Trip to Paris"
                required
                disabled={loading}
              />
            </div>
          </div>

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
              disabled={loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                'Creating...'
              ) : (
                <>
                  <PlusIcon className="mr-2 h-4 w-4 inline" />
                  Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}