// src/components/customer/recommendations/FaceAnalysisModal.jsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Camera, Upload, RefreshCw, Sparkles, AlertCircle, IndianRupee } from 'lucide-react';

const ANALYSIS_PRICE = 10;

const FaceAnalysisModal = ({ isOpen, onClose, onAnalysisComplete }) => {
  const [step, setStep] = useState('payment');
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  const API_URL = import.meta.env.VITE_RECOMMENDATION_API_URL || 'http://localhost:5004/api';

  useEffect(() => {
    if (!cameraActive) return;

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 }
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError('Camera access denied. Please allow camera permission or upload a photo.');
        setCameraActive(false);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [cameraActive]);

  const stopCamera = useCallback(() => {
    setCameraActive(false);
  }, []);

  const handlePayment = async () => {
    setPaying(true);
    setError('');

    try {
      const orderRes = await fetch(`${API_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!orderRes.ok) throw new Error('Order creation failed');
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error('Order creation failed');

      // Razorpay keys hain to real checkout, nahi to mock
      if (orderData.keyId && orderData.keyId !== 'rzp_test_placeholder') {
        await loadRazorpayScript();
        const razorpay = new window.Razorpay({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.orderId,
          name: 'Silverscisor',
          description: 'AI Face Analysis',
          handler: async function (response) {
            await verifyPayment(response);
          },
          prefill: { contact: '', email: '' },
          theme: { color: '#f43f5e' },
          modal: { ondismiss: () => setPaying(false) },
        });
        razorpay.open();
      } else {
        // Mock payment for testing
        await new Promise(r => setTimeout(r, 1000));
        setPaid(true);
        setStep('capture');
        setPaying(false);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      setPaying(false);
    }
  };

  const verifyPayment = async (razorpayResponse) => {
    try {
      const verifyRes = await fetch(`${API_URL}/verify-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpayOrderId: razorpayResponse.razorpay_order_id,
          razorpayPaymentId: razorpayResponse.razorpay_payment_id,
          razorpaySignature: razorpayResponse.razorpay_signature,
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setPaid(true);
        setStep('capture');
      } else {
        setError('Payment verification failed');
      }
    } catch {
      setError('Payment verification failed');
    }
    setPaying(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
    setStep('preview');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCapturedImage(reader.result);
      setStep('preview');
    };
    reader.readAsDataURL(file);
  };

  const analyzePhoto = async () => {
    setStep('analyzing');
    setError('');

    try {
      const response = await fetch(`${API_URL}/analyze-face`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: capturedImage })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const json = await response.json();
      const result = json.data;

      onAnalysisComplete(result, capturedImage);
      handleClose();

    } catch (err) {
      setError('Analysis failed. Please try again.');
      setStep('preview');
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setStep('capture');
    setError('');
    setCameraActive(true);
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setStep('payment');
    setError('');
    setPaid(false);
    onClose();
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve();
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md mx-2 overflow-hidden">
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 dark:from-slate-700 dark:to-slate-600 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">AI Style Analysis</h2>
              <p className="text-[10px] sm:text-xs text-white/80 truncate">Get personalized recommendations</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition text-white flex-shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6">

          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* STEP 0: Payment */}
          {step === 'payment' && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-gradient-to-r from-rose-500 to-amber-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Unlock AI-powered style recommendations
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">AI Face Analysis</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-100">
                    <IndianRupee className="w-3.5 h-3.5 inline" />{ANALYSIS_PRICE}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Personalized Recommendations</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <hr className="border-gray-200 dark:border-gray-600" />
                <div className="flex items-center justify-between font-bold">
                  <span className="text-gray-800 dark:text-gray-100">Total</span>
                  <span className="text-gray-800 dark:text-gray-100">
                    <IndianRupee className="w-3.5 h-3.5 inline" />{ANALYSIS_PRICE}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={paying}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-amber-600 transition disabled:opacity-60"
              >
                {paying ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <IndianRupee className="w-5 h-5" />
                    Pay ₹{ANALYSIS_PRICE} & Analyze
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-400">
                Secure payment • Money-back if analysis fails
              </p>
            </div>
          )}

          {/* STEP 1: Capture */}
          {step === 'capture' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {paid && <span className="text-green-600 font-medium block mb-1">✓ Payment successful!</span>}
                Take a selfie or upload your photo
              </p>

              {cameraActive ? (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-square max-h-[50vh]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-32 sm:w-48 h-40 sm:h-60 border-2 border-white/60 rounded-full border-dashed"></div>
                  </div>
                  <p className="absolute bottom-3 left-0 right-0 text-center text-white text-[10px] sm:text-xs">
                    Position your face in the circle
                  </p>
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl flex flex-col items-center justify-center gap-3">
                  <Camera className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Camera not started</p>
                </div>
              )}

              <canvas ref={canvasRef} className="hidden" />

              <div className="grid grid-cols-2 gap-3">
                {!cameraActive ? (
                  <button
                    onClick={() => setCameraActive(true)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-amber-600 transition col-span-2"
                  >
                    <Camera className="w-5 h-5" />
                    Open Camera
                  </button>
                ) : (
                  <button
                    onClick={capturePhoto}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-amber-600 transition col-span-2"
                  >
                    <Camera className="w-5 h-5" />
                    Capture Photo
                  </button>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition col-span-2"
                >
                  <Upload className="w-5 h-5" />
                  Upload Photo
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* STEP 2: Preview */}
          {step === 'preview' && capturedImage && (
            <div className="space-y-4">
              <div className="relative rounded-xl overflow-hidden aspect-square">
                <img
                  src={capturedImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleRetake}
                  className="flex items-center justify-center gap-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <RefreshCw className="w-5 h-5" />
                  Retake
                </button>
                <button
                  onClick={analyzePhoto}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-amber-500 text-white py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-amber-600 transition"
                >
                  <Sparkles className="w-5 h-5" />
                  Analyze
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Analyzing */}
          {step === 'analyzing' && (
            <div className="py-8 flex flex-col items-center gap-4">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-rose-200 dark:border-rose-900 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-rose-500 rounded-full animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-rose-500" />
              </div>

              <div className="text-center space-y-2">
                <p className="font-bold text-gray-800 dark:text-gray-100">
                  Analyzing your photo...
                </p>
                <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                  <p>✓ Detecting face shape</p>
                  <p>✓ Analyzing skin tone</p>
                  <p>⟳ Finding best styles...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceAnalysisModal;