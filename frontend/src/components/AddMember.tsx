import React, { useState } from 'react';
import { XIcon, MailIcon, UserPlusIcon } from 'lucide-react';
import axios from 'axios';

interface AddMemberPopupProps {
  groupId: string | undefined;
  onClose: () => void;
  onMemberAdded: () => void;
}

export function AddMemberPopup({ groupId, onClose, onMemberAdded }: AddMemberPopupProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token || !groupId) {
        throw new Error('Authentication required');
      }

      const response = await axios.post(
        `https://figroup.onrender.com/api/groups/${groupId}/members`,
        { 
          email:email,
          group_id: groupId
        },
        { headers: { 'x-auth-token': token } }
      );

      // Handle successful response
      if (response.data && response.data.msg) {
        setSuccess(response.data.msg);
      } else {
        setSuccess('Member added successfully!');
      }
      
      setEmail('');
      onMemberAdded(); // Refresh parent component
      
      // Close popup after 2 seconds if successful
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Failed to add member:', err);
      
      // Handle different error cases
      if (axios.isAxiosError(err)) {
        if (err.response) {
          // Server responded with a status code that falls out of 2xx
          setError(err.response.data?.msg || err.response.data?.message || 'Failed to add member');
        } else if (err.request) {
          // Request was made but no response received
          setError('No response from server. Please try again.');
        } else {
          // Something happened in setting up the request
          setError('Request error. Please try again.');
        }
      } else {
        // Non-Axios error
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
          <h2 className="text-xl font-bold text-gray-900">Add New Member</h2>
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

          {success && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-start">
              <div className="flex-shrink-0">
                <UserPlusIcon className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Member Email
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-2 border-gray-300 rounded-md"
                placeholder="member@example.com"
                required
                disabled={loading}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter the email address of the person you want to add to this group.
            </p>
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
                'Adding...'
              ) : (
                <>
                  <UserPlusIcon className="mr-2 h-4 w-4 inline" />
                  Add Member
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}