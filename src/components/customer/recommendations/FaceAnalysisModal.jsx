// src/components/customer/recommendations/FaceAnalysisModal.jsx

import React, { useState, useRef, useCallback } from 'react';
import { X, Camera, Upload, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

const FaceAnalysisModal = ({ isOpen, onClose, onAnalysisComplete }) => {
  const [step, setStep] = useState('capture'); // 'capture', 'preview', 'analyzing', 'result'
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  // Camera start karo
  const startCamera = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
      }
    } catch (err) {
      setError('Camera access denied. Please allow camera permission or upload a photo.');
    }
  };

  // Camera band karo
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setCameraActive(false);
    }
  }, []);

  // Photo capture karo
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    // Mirror effect (selfie mode)
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    stopCamera();
    setStep('preview');
  };

  // File upload karo
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

  // Analyze karo
  const analyzePhoto = async () => {
    setStep('analyzing');
    setError('');

    try {
      // TODO: Python API call yahan hoga
      // const response = await fetch('/api/analyze-face', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ image: capturedImage })
      // });
      // const data = await response.json();

      // Simulate API call (Python service ke liye)
      await new Promise(resolve => setTimeout(resolve, 2500));

      // Mock result (Python service ready hone pe replace karo)
      const mockResult = {
        faceShape: 'Oval',
        skinTone: 'Medium',
        currentHairLength: 'Short',
        recommendations: {
          haircuts: [
            {
              id: 1,
              name: 'Classic Undercut',
              confidence: 95,
              description: 'Perfect for oval face shape',
              price: 250,
              duration: '30 min',
              tags: ['Trending', 'Best Match']
            },
            {
              id: 2,
              name: 'Textured Crop',
              confidence: 88,
              description: 'Modern and stylish look',
              price: 200,
              duration: '25 min',
              tags: ['Popular']
            },
            {
              id: 3,
              name: 'Side Part',
              confidence: 82,
              description: 'Classic professional style',
              price: 180,
              duration: '20 min',
              tags: ['Classic']
            }
          ],
          beardStyles: [
            {
              id: 1,
              name: 'Short Stubble',
              confidence: 92,
              description: 'Suits your face shape perfectly',
              price: 100,
              duration: '15 min',
              tags: ['Best Match']
            },
            {
              id: 2,
              name: 'French Beard',
              confidence: 85,
              description: 'Elegant and sophisticated',
              price: 120,
              duration: '20 min',
              tags: ['Trending']
            }
          ],
          hairColors: [
            {
              id: 1,
              name: 'Dark Brown',
              confidence: 90,
              description: 'Complements your skin tone',
              colorCode: '#3B1F0A',
              price: 800,
              duration: '60 min',
              tags: ['Best Match']
            },
            {
              id: 2,
              name: 'Natural Black',
              confidence: 85,
              description: 'Classic and timeless',
              colorCode: '#1A1A1A',
              price: 700,
              duration: '50 min',
              tags: ['Classic']
            }
          ]
        }
      };

      onAnalysisComplete(mockResult, capturedImage);
      handleClose();

    } catch (err) {
      setError('Analysis failed. Please try again.');
      setStep('preview');
    }
  };

  // Reset
  const handleRetake = () => {
    setCapturedImage(null);
    setStep('capture');
    setError('');
  };

  // Close
  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    setStep('capture');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-amber-500 dark:from-slate-700 dark:to-slate-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-white" />
            <div>
              <h2 className="text-lg font-bold text-white">AI Style Analysis</h2>
              <p className="text-xs text-white/80">Get personalized recommendations</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-lg transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* STEP 1: Capture */}
          {step === 'capture' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                Take a selfie or upload your photo for personalized style recommendations
              </p>

              {/* Camera Preview */}
              {cameraActive ? (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-square">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                    style={{ transform: 'scaleX(-1)' }}
                  />
                  {/* Face guide overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-60 border-2 border-white/60 rounded-full border-dashed"></div>
                  </div>
                  <p className="absolute bottom-3 left-0 right-0 text-center text-white text-xs">
                    Position your face in the circle
                  </p>
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl flex flex-col items-center justify-center gap-3">
                  <Camera className="w-16 h-16 text-gray-400 dark:text-gray-500" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Camera not started</p>
                </div>
              )}

              {/* Hidden Canvas */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {!cameraActive ? (
                  <button
                    onClick={startCamera}
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
              {/* Animated analyzing */}
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