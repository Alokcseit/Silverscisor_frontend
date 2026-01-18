// src/components/customer/ServiceSelection.jsx

import React from 'react';
import { Star } from 'lucide-react';

const ServiceSelection = ({ selectedService, setSelectedService, setShowBookingForm }) => {
  
  const services = [
    {
      id: 1,
      name: 'Haircut',
      duration: '30 मिनट',
      price: 200,
      description: 'प्रोफेशनल हेयरकट सर्विस',
      rating: 4.5,
      reviews: 120
    },
    {
      id: 2,
      name: 'Beard Trim',
      duration: '15 मिनट',
      price: 100,
      description: 'दाढ़ी की स्टाइलिंग और ट्रिमिंग',
      rating: 4.7,
      reviews: 95
    },
    {
      id: 3,
      name: 'Haircut + Beard',
      duration: '45 मिनट',
      price: 250,
      description: 'कॉम्बो पैकेज - बेस्ट वैल्यू',
      rating: 4.8,
      reviews: 200
    },
    {
      id: 4,
      name: 'Hair Color',
      duration: '60 मिनट',
      price: 800,
      description: 'प्रीमियम हेयर कलरिंग',
      rating: 4.6,
      reviews: 80
    },
    {
      id: 5,
      name: 'Facial',
      duration: '45 मिनट',
      price: 500,
      description: 'स्किन केयर और फेशियल',
      rating: 4.9,
      reviews: 150
    },
    {
      id: 6,
      name: 'Head Massage',
      duration: '20 मिनट',
      price: 150,
      description: 'आराम देने वाली मसाज',
      rating: 5.0,
      reviews: 75
    }
  ];

  const handleServiceClick = (service) => {
    setSelectedService(service);
    setShowBookingForm(true);
    // Scroll to booking form
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-800">हमारी सेवाएं</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => handleServiceClick(service)}
            className={`bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 cursor-pointer border-2 ${
              selectedService?.id === service.id
                ? 'border-purple-600 bg-purple-50'
                : 'border-transparent hover:border-purple-600'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-800">{service.name}</h4>
                <p className="text-sm text-gray-500">{service.duration}</p>
              </div>
              <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-bold">
                ₹{service.price}
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-4">{service.description}</p>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-gray-600">
                {service.rating} ({service.reviews} रिव्यू)
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSelection;