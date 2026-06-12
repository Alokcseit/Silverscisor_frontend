// src/components/admin/system/SystemLogs.jsx

import React, { useState } from 'react';
import { AlertCircle, Info, XCircle, Filter, Loader } from 'lucide-react';
import { useSystemLogs } from '../../../hooks/useAdmin';

const LEVEL_CONFIG = {
  info:     { icon: Info,        color: 'text-blue-400',   bg: 'bg-blue-900/20',   border: 'border-blue-800'   },
  warn:     { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-800' },
  error:    { icon: XCircle,     color: 'text-red-400',    bg: 'bg-red-900/20',    border: 'border-red-800'    },
  critical: { icon: XCircle,     color: 'text-red-500',    bg: 'bg-red-900/30',    border: 'border-red-700'    }
};

const SystemLogs = () => {
  const [level, setLevel] = useState('');
  const [service, setService] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useSystemLogs({ level, service, page, limit: 20 });
  const logs = data?.data || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-700 flex flex-wrap gap-3 items-center">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={level}
          onChange={e => setLevel(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Levels</option>
          <option value="info">Info</option>
          <option value="warn">Warning</option>
          <option value="error">Error</option>
          <option value="critical">Critical</option>
        </select>
        <select
          value={service}
          onChange={e => setService(e.target.value)}
          className="bg-gray-700 border border-gray-600 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
        >
          <option value="">All Services</option>
          <option value="auth">Auth</option>
          <option value="salon">Salon</option>
          <option value="admin">Admin</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Logs */}
      <div className="divide-y divide-gray-700">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 text-gray-500 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No logs found</div>
        ) : (
          logs.map(log => {
            const cfg = LEVEL_CONFIG[log.level] || LEVEL_CONFIG.info;
            const Icon = cfg.icon;
            return (
              <div key={log._id} className={`p-4 ${cfg.bg} border-l-4 ${cfg.border}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Icon className={`w-5 h-5 ${cfg.color} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-xs font-bold uppercase ${cfg.color}`}>{log.level}</span>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-400 text-xs capitalize">{log.service}</span>
                        <span className="text-gray-600 text-xs">·</span>
                        <span className="text-gray-400 text-xs font-medium">{log.action}</span>
                      </div>
                      <p className="text-gray-200 text-sm">{log.message}</p>
                      {log.metadata?.userId && (
                        <p className="text-gray-500 text-xs mt-1">User: {log.metadata.userId}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-gray-500 text-xs whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-700 flex items-center justify-between">
        <p className="text-gray-400 text-sm">Total: {data?.total || 0}</p>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-40 transition">
            Prev
          </button>
          <span className="px-3 py-1.5 text-gray-400 text-sm">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-40 transition">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemLogs;