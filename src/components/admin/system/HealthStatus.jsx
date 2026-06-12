// src/components/admin/system/HealthStatus.jsx

import React from 'react';
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Server, Database, Zap } from 'lucide-react';
import { useSystemHealth } from '../../../hooks/useAdmin';

const ServiceCard = ({ name, status, details }) => {
  const isHealthy = status === 'healthy';
  const isDown = status === 'down';

  return (
    <div className={`bg-gray-800 rounded-xl p-5 border ${
      isHealthy ? 'border-green-800' : isDown ? 'border-red-800' : 'border-yellow-800'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Server className="w-5 h-5 text-gray-400" />
          <h3 className="font-bold text-white capitalize">{name} Service</h3>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
          isHealthy ? 'bg-green-900/30 text-green-400' :
          isDown ? 'bg-red-900/30 text-red-400' :
          'bg-yellow-900/30 text-yellow-400'
        }`}>
          {isHealthy ? <CheckCircle className="w-3 h-3" /> :
           isDown ? <XCircle className="w-3 h-3" /> :
           <AlertCircle className="w-3 h-3" />}
          {status}
        </div>
      </div>

      {details && (
        <div className="space-y-2">
          {details.db && (
            <div className="flex items-center gap-2 text-sm">
              <Database className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400">DB:</span>
              <span className={details.db === 'connected' ? 'text-green-400' : 'text-red-400'}>
                {details.db}
              </span>
            </div>
          )}
          {details.uptime && (
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400">Uptime:</span>
              <span className="text-gray-300">{details.uptime}</span>
            </div>
          )}
          {details.memory && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400 ml-6">Memory:</span>
              <span className="text-gray-300">{details.memory.heapUsed}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const HealthStatus = () => {
  const { data, isLoading, refetch } = useSystemHealth();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {['admin', 'auth', 'salon'].map(s => (
          <div key={s} className="bg-gray-800 rounded-xl p-5 border border-gray-700 h-32 animate-pulse" />
        ))}
      </div>
    );
  }

  const services = data?.services || {};

  return (
    <div className="space-y-4">
      {/* Overall Status */}
      <div className={`flex items-center justify-between p-4 rounded-xl border ${
        data?.overall === 'healthy'
          ? 'bg-green-900/20 border-green-800'
          : 'bg-yellow-900/20 border-yellow-800'
      }`}>
        <div className="flex items-center gap-3">
          {data?.overall === 'healthy'
            ? <CheckCircle className="w-6 h-6 text-green-400" />
            : <AlertCircle className="w-6 h-6 text-yellow-400" />
          }
          <div>
            <p className="font-bold text-white">
              {data?.overall === 'healthy' ? 'All Systems Operational' : 'System Degraded'}
            </p>
            <p className="text-gray-400 text-sm">{data?.timestamp}</p>
          </div>
        </div>
        <button onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600 transition">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ServiceCard name="Admin" status={services.admin?.status} details={services.admin} />
        <ServiceCard name="Auth" status={services.auth?.status} details={services.auth} />
        <ServiceCard name="Salon" status={services.salon?.status} details={services.salon} />
      </div>
    </div>
  );
};

export default HealthStatus;