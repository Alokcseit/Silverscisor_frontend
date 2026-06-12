// src/components/admin/dashboard/RecentActivity.jsx

import React from 'react';
import { Activity, CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';
import { useSystemLogs } from '../../../hooks/useAdmin';

const LEVEL_CONFIG = {
  info:     { icon: Info,          color: 'text-blue-400',   bg: 'bg-blue-900/20'   },
  warn:     { icon: AlertCircle,   color: 'text-yellow-400', bg: 'bg-yellow-900/20' },
  error:    { icon: XCircle,       color: 'text-red-400',    bg: 'bg-red-900/20'    },
  critical: { icon: XCircle,       color: 'text-red-500',    bg: 'bg-red-900/30'    }
};

const RecentActivity = () => {
  const { data, isLoading } = useSystemLogs({ limit: 8 });
  const logs = data?.data || [];

  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700">
      <div className="flex items-center gap-2 mb-5">
        <Activity className="w-5 h-5 text-indigo-400" />
        <h3 className="font-bold text-white">Recent Activity</h3>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-12 bg-gray-700 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No recent activity</div>
      ) : (
        <div className="space-y-2">
          {logs.map(log => {
            const cfg = LEVEL_CONFIG[log.level] || LEVEL_CONFIG.info;
            const Icon = cfg.icon;
            return (
              <div key={log._id} className={`flex items-start gap-3 p-3 rounded-lg ${cfg.bg}`}>
                <Icon className={`w-4 h-4 ${cfg.color} flex-shrink-0 mt-0.5`} />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-200 text-sm font-medium truncate">{log.action}</p>
                  <p className="text-gray-400 text-xs truncate">{log.message}</p>
                </div>
                <span className="text-gray-500 text-xs whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentActivity;