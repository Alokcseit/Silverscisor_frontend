import React from 'react';
import { Star, Scissors, User, Palette, Sparkles, Zap, Clock, CheckCircle2 } from 'lucide-react';
// ध्यान दें: अपने फोल्डर स्ट्रक्चर के अनुसार सही पाथ दें
import DecorativeBackground from '../../util/DecorativeBackground';

const ServiceSelection = ({ selectedService, setSelectedService, setShowBookingForm }) => {
  
  // Services Data with Icons added
  const services = [
    {
      id: 1,
      name: 'Haircut',
      icon: Scissors,
      duration: '30 मिनट',
      price: 200,
      description: 'प्रोफेशनल हेयरकट सर्विस',
      rating: 4.5,
      reviews: 120,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      id: 2,
      name: 'Beard Trim',
      icon: User,
      duration: '15 मिनट',
      price: 100,
      description: 'दाढ़ी की स्टाइलिंग और ट्रिमिंग',
      rating: 4.7,
      reviews: 95,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      id: 3,
      name: 'Haircut + Beard',
      icon: Zap, // Combo icon
      duration: '45 minutes',
      price: 250,
      description: 'COMBO SERVICE & BEST DEAL',
      rating: 4.8,
      reviews: 200,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      id: 4,
      name: 'Hair Color',
      icon: Palette,
      duration: '60 minutes',
      price: 800,
      description: 'ARTISTIC HAIR COLOR',
      rating: 4.6,
      reviews: 80,
      color: 'text-pink-500',
      bg: 'bg-pink-100 dark:bg-pink-900/30'
    },
    {
      id: 5,
      name: 'Facial',
      icon: Sparkles,
      duration: '45 minutes',
      price: 500,
      description: 'SKINN CARE & FACIAL',
      rating: 4.9,
      reviews: 150,
      color: 'text-orange-500',
      bg: 'bg-orange-100 dark:bg-orange-900/30'
    },
    {
      id: 6,
      name: 'Head Massage',
      icon: User, // Can use a relaxed icon
      duration: '20 मिनट',
      price: 150,
      description: 'आराम देने वाली मसाज',
      rating: 5.0,
      reviews: 75,
      color: 'text-teal-500',
      bg: 'bg-teal-100 dark:bg-teal-900/30'
    }
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowBookingForm(true);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    // Main Container set to relative so background stays inside
    <div className="relative w-full bg-gray-50 dark:bg-gray-900 py-12 transition-colors duration-300 mb-10 overflow-hidden">
      
      {/* 1. SVG Background Added Here */}
      <div className="absolute inset-0 z-0">
         <DecorativeBackground />
      </div>

      {/* 2. Content Container (z-10 ensures content is above background) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            हमारी प्रीमियम <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">सेवाएं</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
             
            अपने लिए सबसे बेहतरीन पैकेज चुनें और रिलैक्स करें।
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            const isSelected = selectedService?.id === service.id;

            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer border-2 backdrop-blur-sm
                  ${isSelected 
                    ? 'border-purple-500 bg-white/90 dark:bg-gray-800/90 shadow-xl shadow-purple-500/20 scale-105' 
                    : 'border-transparent bg-white/80 dark:bg-gray-800/80 shadow-lg hover:shadow-2xl hover:scale-[1.02] hover:border-purple-300 dark:hover:border-purple-700'
                  }
                `}
              >
                {/* Internal Card Blob Effect */}
                <div className={`absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 rounded-full opacity-20 blur-2xl transition-all duration-500 group-hover:scale-150 ${service.bg.replace('/30', '')}`}></div>

                <div className="p-6 relative z-10">
                  {/* Top Row: Icon and Price */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${service.bg} ${service.color} transition-transform duration-500 group-hover:rotate-12`}>
                      <IconComponent className="w-8 h-8" strokeWidth={1.5} />
                    </div>
                    
                    <div className="flex flex-col items-end">
                       <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        ₹{service.price}
                       </span>
                       {isSelected && (
                         <div className="flex items-center gap-1 text-xs font-bold text-green-600 dark:text-green-400 animate-pulse">
                           <CheckCircle2 className="w-3 h-3" /> Selected
                         </div>
                       )}
                    </div>
                  </div>

                  {/* Content: Title & Desc */}
                  <h4 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {service.name}
                  </h4>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {service.description}
                  </p>

                  {/* Footer: Time & Rating */}
                  <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{service.duration}</span>
                    </div>

                    <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                        {service.rating}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({service.reviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;