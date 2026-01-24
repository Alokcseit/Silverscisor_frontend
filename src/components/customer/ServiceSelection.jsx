import React from 'react';
import { Star, Scissors, User, Palette, Sparkles, Zap, Clock, Check, ChevronRight } from 'lucide-react';
import DecorativeBackground from '../../util/DecorativeBackground';

const ServiceSelection = ({ selectedService, setSelectedService, setShowBookingForm }) => {
  
  const services = [
    {
      id: 1,
      name: 'Haircut',
      icon: Scissors,
      duration: '30 min',
      price: 200,
      description: 'Classic & modern cuts tailored to your style.',
      rating: 4.5,
      reviews: 120,
      gradient: 'from-blue-500 to-cyan-400',
      shadow: 'shadow-blue-500/20'
    },
    {
      id: 2,
      name: 'Beard Trim',
      icon: User,
      duration: '15 min',
      price: 100,
      description: 'Sharp lines and perfect grooming.',
      rating: 4.7,
      reviews: 95,
      gradient: 'from-emerald-500 to-teal-400',
      shadow: 'shadow-emerald-500/20'
    },
    {
      id: 3,
      name: 'Hair + Beard',
      icon: Zap,
      duration: '45 min',
      price: 250,
      description: 'Complete makeover combo package.',
      rating: 4.8,
      reviews: 200,
      gradient: 'from-violet-600 to-purple-500', // Premium color
      shadow: 'shadow-purple-500/20',
      featured: true
    },
    {
      id: 4,
      name: 'Hair Color',
      icon: Palette,
      duration: '60 min',
      price: 800,
      description: 'Premium coloring & highlights.',
      rating: 4.6,
      reviews: 80,
      gradient: 'from-pink-500 to-rose-400',
      shadow: 'shadow-pink-500/20'
    },
    {
      id: 5,
      name: 'Facial',
      icon: Sparkles,
      duration: '45 min',
      price: 500,
      description: 'Deep cleansing & glow therapy.',
      rating: 4.9,
      reviews: 150,
      gradient: 'from-orange-500 to-amber-400',
      shadow: 'shadow-orange-500/20'
    },
    {
      id: 6,
      name: 'Massage',
      icon: User,
      duration: '20 min',
      price: 150,
      description: 'Relaxing head & shoulder massage.',
      rating: 5.0,
      reviews: 75,
      gradient: 'from-indigo-500 to-blue-500',
      shadow: 'shadow-indigo-500/20'
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
    <div className="relative w-full bg-gray-50 dark:bg-gray-950 py-16 transition-colors duration-300 overflow-hidden">
      
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(#6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>
      
      <div className="absolute inset-0 z-0">
         <DecorativeBackground />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Modern Header */}
        <div className="text-center mb-16 space-y-4">
          <span className="inline-block py-1 px-3 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 text-xs font-bold tracking-wider uppercase border border-purple-200 dark:border-purple-700">
            Services Menu
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Choose Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Style</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Premium grooming services designed for the modern gentleman.
          </p>
        </div>

        {/* Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            const isSelected = selectedService?.id === service.id;

            return (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service)}
                className={`
                  group relative rounded-3xl p-1 cursor-pointer transition-all duration-300 ease-out
                  ${isSelected ? 'transform -translate-y-2' : 'hover:-translate-y-1'}
                `}
              >
                {/* Gradient Border Effect (Absolute) */}
                <div className={`
                  absolute inset-0 rounded-3xl bg-gradient-to-br opacity-0 transition-opacity duration-300
                  ${service.gradient}
                  ${isSelected ? 'opacity-100 blur-sm' : 'group-hover:opacity-70 group-hover:blur-sm'}
                `}></div>

                {/* Main Card Content */}
                <div className={`
                  relative h-full bg-white dark:bg-gray-900 rounded-[22px] p-6 overflow-hidden border transition-colors
                  ${isSelected ? 'border-transparent' : 'border-gray-100 dark:border-gray-800'}
                `}>
                  
                  {/* Background Blobs for specific card */}
                  <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${service.gradient} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`}></div>

                  {/* Top Section: Icon & Price */}
                  <div className="flex justify-between items-start mb-6">
                    {/* Icon Box */}
                    <div className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3
                      bg-gradient-to-br ${service.gradient} ${service.shadow}
                    `}>
                      <IconComponent className="w-7 h-7" strokeWidth={1.5} />
                    </div>

                    {/* Price Tag */}
                    <div className="text-right">
                      <p className="text-2xl font-black text-gray-900 dark:text-white">₹{service.price}</p>
                      <p className="text-xs font-medium text-gray-400 dark:text-gray-500">Starting price</p>
                    </div>
                  </div>

                  {/* Middle Section: Info */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                      {service.name}
                      {service.featured && (
                         <span className="bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm">
                           BESTSELLER
                         </span>
                      )}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Bottom Section: Metrics & Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                    
                    {/* Duration & Rating */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {service.duration}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-300">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        {service.rating} <span className="text-gray-400 font-normal">({service.reviews})</span>
                      </div>
                    </div>

                    {/* Select Button Indicator */}
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300
                      ${isSelected 
                        ? `bg-gradient-to-r ${service.gradient} text-white shadow-md scale-110` 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                      }
                    `}>
                      {isSelected ? <Check className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
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