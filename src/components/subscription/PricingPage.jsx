// src/components/subscription/PricingPage.jsx

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Crown, Zap, Shield, HelpCircle } from 'lucide-react';
import SubscriptionCard from './SubscriptionCard';
import { setPlan } from '../../store/subscriptionSlice';
import { useNotification } from '../../context/NotificationContext';

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    tokens: 0,
    features: [
      { text: '10 bookings per month', included: true },
      { text: 'Basic queue management', included: true },
      { text: 'Customer notifications (In-app)', included: true },
      { text: '1 staff member', included: true },
      { text: 'Email notifications', included: false },
      { text: 'WhatsApp notifications', included: false },
      { text: 'AI Style recommendations', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'No watermark', included: false }
    ]
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 499,
    tokens: 500,
    features: [
      { text: 'Unlimited bookings', included: true },
      { text: 'Smart queue management', included: true },
      { text: 'Email notifications', included: true },
      { text: '3 staff members', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'No Silverscisor watermark', included: true },
      { text: 'WhatsApp notifications', included: false },
      { text: 'AI Style recommendations', included: false },
      { text: 'Advanced analytics', included: false }
    ]
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 999,
    tokens: 1500,
    popular: true,
    features: [
      { text: 'Unlimited bookings', included: true },
      { text: 'WhatsApp notifications', included: true },
      { text: 'AI Style recommendations', included: true },
      { text: 'Advanced analytics', included: true },
      { text: '10 staff members', included: true },
      { text: 'Priority support', included: true },
      { text: 'Custom booking page', included: true },
      { text: 'No watermark', included: true },
      { text: 'Multiple branches', included: false }
    ]
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 1999,
    tokens: null,
    features: [
      { text: 'Everything in Gold', included: true },
      { text: 'Unlimited tokens', included: true },
      { text: 'Unlimited staff members', included: true },
      { text: 'Multiple branches', included: true },
      { text: 'API access', included: true },
      { text: 'Dedicated support', included: true },
      { text: 'White label option', included: true },
      { text: 'Custom integrations', included: true },
      { text: 'Revenue analytics', included: true }
    ]
  }
];

const FAQ_ITEMS = [
  {
    q: 'Kya plan kabhi bhi cancel kar sakte hain?',
    a: 'Haan, kisi bhi waqt cancel kar sakte hain. Current month ke end tak plan active rahega.'
  },
  {
    q: 'Tokens expire hote hain kya?',
    a: 'Monthly tokens expire ho jaate hain. Alag se kharide gaye tokens 1 saal tak valid hain.'
  },
  {
    q: 'Free plan se upgrade karne pe data safe rahega?',
    a: 'Bilkul! Aapki saari bookings aur customer data safe rahega.'
  },
  {
    q: 'Payment methods kaunse hain?',
    a: 'UPI, Credit/Debit Card, Net Banking - sabhi accept kiye jaate hain via Razorpay.'
  }
];

const PricingPage = () => {
  const dispatch = useDispatch();
  const { success } = useNotification();
  const { plan: currentPlan } = useSelector(state => state.subscription);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [isYearly, setIsYearly] = useState(false);

  const handlePlanSelect = (plan) => {
    if (plan.price === 0) {
      dispatch(setPlan({ plan: plan.id, expiry: null, tokens: 0 }));
      success('Free plan activated!');
      return;
    }

    // TODO: Razorpay integration
    alert(`Razorpay integration coming soon!\nPlan: ${plan.name}\nPrice: ₹${plan.price}/month`);
  };

  const getYearlyPrice = (monthlyPrice) => {
    return Math.round(monthlyPrice * 10); // 2 months free
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          <Crown className="w-4 h-4" />
          Subscription Plans
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Apne Salon Ko Grow Karein
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
          Shuruaat free se karein, aur jab zaroorat ho tab upgrade karein. Koi hidden charges nahi.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <span className={`text-sm font-medium ${!isYearly ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              isYearly ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform shadow ${
              isYearly ? 'translate-x-7' : 'translate-x-1'
            }`} />
          </button>
          <span className={`text-sm font-medium ${isYearly ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
            Yearly
            <span className="ml-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-0.5 rounded-full">
              2 months FREE
            </span>
          </span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {PLANS.map(plan => (
          <SubscriptionCard
            key={plan.id}
            plan={{
              ...plan,
              price: isYearly && plan.price > 0
                ? getYearlyPrice(plan.price)
                : plan.price,
              priceLabel: isYearly ? '/year' : '/month'
            }}
            isCurrentPlan={currentPlan === plan.id}
            onSelect={handlePlanSelect}
          />
        ))}
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
          <Crown className="w-8 h-8 text-amber-500 mb-3" />
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Gold Plan Best Hai</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            WhatsApp notifications, AI recommendations aur advanced analytics ke saath salon ka revenue 3x tak badh sakta hai.
          </p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
          <Zap className="w-8 h-8 text-purple-500 mb-3" />
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Token System</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            WhatsApp messages, AI analysis ke liye tokens use karein. Zaroorat se zyada pe extra kharcho mat.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
          <Shield className="w-8 h-8 text-green-500 mb-3" />
          <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Secure Payment</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Razorpay se secure payment. UPI, card, net banking sab accept. Koi hidden charges nahi.
          </p>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6 flex items-center justify-center gap-2">
          <HelpCircle className="w-6 h-6 text-amber-500" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                  {item.q}
                </span>
                <span className={`text-gray-500 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {expandedFaq === index && (
                <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;