// src/components/admin/users/UserTable.jsx

import React, { useState, useCallback } from 'react';
import { Search, XCircle, CheckCircle, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAdminUsers, useBlockUser, useUnblockUser } from '../../../hooks/useAdmin';

const UserTable = () => {
  const [search, setSearch] = useState('');
  const [userType, setUserType] = useState('');
  const [cursorStack, setCursorStack] = useState([]);
  const [cursor, setCursor] = useState(null);

  const params = { limit: 15 };
  if (search) params.search = search;
  if (userType) params.userType = userType;
  if (cursor) params.cursor = cursor;

  const { data, isLoading } = useAdminUsers(params);
  const blockMutation = useBlockUser();
  const unblockMutation = useUnblockUser();

  const users = data?.data || [];
  const nextCursor = data?.nextCursor || null;
  const hasMore = data?.hasMore || false;
  const total = data?.total || 0;

  const handleNext = useCallback(() => {
    if (!nextCursor) return;
    setCursorStack(prev => [...prev, nextCursor]);
    setCursor(nextCursor);
  }, [nextCursor]);

  const handlePrev = useCallback(() => {
    if (cursorStack.length === 0) return;
    const newStack = [...cursorStack];
    newStack.pop();
    setCursorStack(newStack);
    setCursor(newStack.length > 0 ? newStack[newStack.length - 1] : null);
  }, [cursorStack]);

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
    setCursorStack([]);
    setCursor(null);
  }, []);

  const handleUserTypeChange = useCallback((e) => {
    setUserType(e.target.value);
    setCursorStack([]);
    setCursor(null);
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-700 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:border-indigo-500 text-sm placeholder-gray-500"
          />
        </div>
        <select
          value={userType}
          onChange={handleUserTypeChange}
          className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Users</option>
          <option value="customer">Customers</option>
          <option value="salon">Salon Owners</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700 text-left">
              {['Username', 'Email', 'Type', 'Joined', 'Status', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-gray-400 text-xs font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="text-center py-12">
                  <Loader className="w-6 h-6 text-gray-500 animate-spin mx-auto" />
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-500">No users found</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} className="hover:bg-gray-700/50 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-600/30 rounded-full flex items-center justify-center text-indigo-400 font-bold text-sm">
                        {user.username?.charAt(0)?.toUpperCase()}
                      </div>
                      <p className="text-white text-sm font-medium">{user.username}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-300 text-sm">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold capitalize ${
                      user.userType === 'salon'
                        ? 'bg-emerald-900/30 text-emerald-400'
                        : 'bg-blue-900/30 text-blue-400'
                    }`}>
                      {user.userType === 'salon' ? 'Salon Owner' : 'Customer'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">
                    {new Date(user.createdAt).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`flex items-center gap-1 text-xs font-semibold ${user.isActive ? 'text-green-400' : 'text-red-400'}`}>
                      {user.isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {user.isActive ? 'Active' : 'Blocked'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.isActive ? (
                      <button
                        onClick={() => handleBlock(user._id)}
                        disabled={blockMutation.isPending}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnblock(user._id)}
                        disabled={unblockMutation.isPending}
                        className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-900/20 rounded-lg transition"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
        <p className="text-gray-400 text-sm">Total: {total}</p>
        <div className="flex gap-2">
          <button
            onClick={handlePrev}
            disabled={cursorStack.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-40 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <button
            onClick={handleNext}
            disabled={!hasMore}
            className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-40 transition"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;
