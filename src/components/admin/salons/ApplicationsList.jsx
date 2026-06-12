// src/components/admin/salons/ApplicationsList.jsx

import React from 'react';
import { CheckCircle, XCircle, Clock, Loader } from 'lucide-react';
import { usePendingApplications, useApproveSalon, useBlockSalon } from '../../../hooks/useAdmin';

const ApplicationsList = () => {
  const { data, isLoading } = usePendingApplications();
  const approveMutation = useApproveSalon();
  const rejectMutation = useBlockSalon();

  const applications = data?.data || [];

  const handleApprove = async (salonId) => {
    await approveMutation.mutateAsync({ salonId, note: 'Approved by admin' });
  };

  const handleReject = async (salonId) => {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    await rejectMutation.mutateAsync({ salonId, reason });
  };

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="p-4 border-b border-gray-700 flex items-center gap-2">
        <Clock className="w-5 h-5 text-amber-400" />
        <h3 className="font-bold text-white">Pending Applications</h3>
        <span className="bg-amber-900/30 text-amber-400 text-xs px-2 py-0.5 rounded-full font-semibold">
          {applications.length}
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-6 h-6 text-gray-500 animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
          <p>No pending applications</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-700">
          {applications.map(app => (
            <div key={app._id} className="p-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-semibold">{app.salonName}</p>
                <p className="text-gray-400 text-sm">{app.ownerName} · {app.ownerPhone}</p>
                <p className="text-gray-500 text-xs mt-1">{app.address?.city}, {app.address?.state}</p>
                <p className="text-gray-600 text-xs mt-1">
                  Applied: {new Date(app.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => handleApprove(app.salonId)}
                  disabled={approveMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => handleReject(app.salonId)}
                  disabled={rejectMutation.isPending}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600/20 text-red-400 text-sm rounded-lg hover:bg-red-600/30 transition disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationsList;