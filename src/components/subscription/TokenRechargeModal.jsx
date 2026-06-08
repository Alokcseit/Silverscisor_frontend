// src/components/subscription/TokenRechargeModal.jsx

import React, { useState } from 'react';
import { X, Zap, CreditCard, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addTokens } from '../../store/subscriptionSlice';
import { useNotification } from '../../context/NotificationContext';

const PACKAGES = [
  { tokens: 100, price: 50 },
  { tokens: 500, price: 200, popular: true },
  { tokens: 1000, price: 350 }
];

const TokenRechargeModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { success } = useNotification();
  const [selectedPackage, setSelectedPackage] = useState(PACKAGES[1]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRecharge = async () => {
    setIsProcessing(true);
    try {
      // TODO: Razorpay integration
      // const razorpay = new window.Razorpay({ ... })
      // razorpay.open()

      await new Promise(resolve => setTimeout(resolve, 1500));

      dispatch(addTokens(selectedPackage.tokens));
      success(`${selectedPackage.tokens} tokens added successfully!`);
      onClose();

    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-white" />
            <h2 className="text-lg font-bold text-white">Token Recharge</h2>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/20 rounded-lg transition text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Package Selection */}
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Select Package
            </p>
            <div className="space-y-2">
              {PACKAGES.map((pkg, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition ${
                    selectedPackage.tokens === pkg.tokens
                      ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPackage.tokens === pkg.tokens
                        ? 'border-amber-500 bg-amber-500'
                        : 'border-gray-400 dark:border-gray-500'
                    }`}>
                      {selectedPackage.tokens === pkg.tokens && (
                        <div className="w-2.5 h-2.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span className="font-bold text-gray-800 dark:text-gray-100">
                        {pkg.tokens} tokens
                      </span>
                      {pkg.popular && (
                        <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-2 py-0.5 rounded-full font-medium">
                          Best Value
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-gray-800 dark:text-gray-100">
                    ₹{pkg.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Tokens</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {selectedPackage.tokens}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-600 dark:text-gray-400">Valid for</span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">1 Year</span>
            </div>
            <div className="flex justify-between font-bold border-t border-gray-200 dark:border-gray-600 pt-3">
              <span className="text-gray-800 dark:text-gray-100">Total</span>
              <span className="text-amber-600 dark:text-amber-400 text-lg">
                ₹{selectedPackage.price}
              </span>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handleRecharge}
            disabled={isProcessing}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white py-4 rounded-xl font-bold hover:from-amber-500 hover:to-orange-600 transition disabled:opacity-60"
          >
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                Pay ₹{selectedPackage.price} via Razorpay
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            🔒 Secure payment via Razorpay · UPI · Cards · Net Banking
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenRechargeModal;