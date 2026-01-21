// src/context/BookingContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext(null);

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Load bookings from localStorage
  useEffect(() => {
    const storedBookings = localStorage.getItem('silverscissor_bookings');
    if (storedBookings) {
      try {
        setBookings(JSON.parse(storedBookings));
      } catch (error) {
        console.error('Error loading bookings:', error);
      }
    }
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    if (bookings.length > 0) {
      localStorage.setItem('silverscissor_bookings', JSON.stringify(bookings));
    }
  }, [bookings]);

  // Add new booking
  const addBooking = (bookingData) => {
    const newBooking = {
      ...bookingData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      status: 'confirmed'
    };
    setBookings([...bookings, newBooking]);
    return newBooking;
  };

  // Update booking
  const updateBooking = (bookingId, updatedData) => {
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, ...updatedData } : booking
    ));
  };

  // Cancel booking
  const cancelBooking = (bookingId) => {
    setBookings(bookings.map(booking =>
      booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
    ));
  };

  // Delete booking
  const deleteBooking = (bookingId) => {
    setBookings(bookings.filter(booking => booking.id !== bookingId));
  };

  // Get booking by ID
  const getBookingById = (bookingId) => {
    return bookings.find(booking => booking.id === bookingId);
  };

  // Get bookings by status
  const getBookingsByStatus = (status) => {
    return bookings.filter(booking => booking.status === status);
  };

  // Get upcoming bookings
  const getUpcomingBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(
      booking => booking.date >= today && booking.status === 'confirmed'
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Clear all bookings
  const clearBookings = () => {
    setBookings([]);
    localStorage.removeItem('silverscissor_bookings');
  };

  const value = {
    bookings,
    selectedService,
    selectedDate,
    selectedTime,
    setSelectedService,
    setSelectedDate,
    setSelectedTime,
    addBooking,
    updateBooking,
    cancelBooking,
    deleteBooking,
    getBookingById,
    getBookingsByStatus,
    getUpcomingBookings,
    clearBookings
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

// Custom hook
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
};