// src/hooks/useRecommendations.js

import { useQuery } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';
import {
  setRecommendedServices,
  setTrendingServices,
  setPersonalizedSuggestions,
  setError
} from '../store/recommendationSlice';

const RECOMMENDATION_API_URL = import.meta.env.VITE_RECOMMENDATION_API_URL || 'http://localhost:5004/api';

// Fallback data jab Python service na ho
const fallbackData = {
  recommended: [
    { id: 1, name: 'Haircut', price: 200, duration: '30 min', score: 0.95, reason: 'Most popular' },
    { id: 2, name: 'Haircut + Beard', price: 250, duration: '45 min', score: 0.89, reason: 'Best value' },
    { id: 3, name: 'Beard Trim', price: 100, duration: '15 min', score: 0.82, reason: 'Quick service' },
  ],
  trending: [
    { id: 1, name: 'Haircut', bookingsToday: 12 },
    { id: 3, name: 'Beard Trim', bookingsToday: 8 },
    { id: 5, name: 'Facial', bookingsToday: 6 },
  ],
  personalized: [
    { id: 2, name: 'Haircut + Beard', price: 250, reason: 'You booked this last time' },
    { id: 4, name: 'Hair Color', price: 800, reason: 'Popular this season' },
  ]
};

// Fetch recommended services
const fetchRecommendations = async (userId) => {
  try {
    const response = await axios.get(
      `${RECOMMENDATION_API_URL}/recommendations/user/${userId}`
    );
    return response.data;
  } catch (error) {
    // Python service available nahi hai to fallback use karo
    console.warn('Recommendation service unavailable, using fallback data');
    return {
      success: true,
      data: fallbackData
    };
  }
};

// Fetch trending services (location based)
const fetchTrending = async (location) => {
  try {
    const response = await axios.get(
      `${RECOMMENDATION_API_URL}/recommendations/trending`,
      { params: { city: location?.city || 'default' } }
    );
    return response.data;
  } catch (error) {
    return {
      success: true,
      data: { trending: fallbackData.trending }
    };
  }
};

// Main hook
export const useRecommendations = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { recommendedServices, trendingServices, personalizedSuggestions, isLoading } =
    useSelector((state) => state.recommendation);

  // TanStack Query - Recommended services
  const recommendedQuery = useQuery({
    queryKey: ['recommendations', user?.id],
    queryFn: () => fetchRecommendations(user?.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,    // 5 minutes
    cacheTime: 10 * 60 * 1000,   // 10 minutes
    retry: 1,
    onSuccess: (data) => {
      if (data?.data) {
        dispatch(setRecommendedServices(data.data.recommended || []));
        dispatch(setPersonalizedSuggestions(data.data.personalized || []));
      }
    },
    onError: (error) => {
      dispatch(setError(error.message));
      dispatch(setRecommendedServices(fallbackData.recommended));
    }
  });

  // TanStack Query - Trending services
  const trendingQuery = useQuery({
    queryKey: ['trending'],
    queryFn: () => fetchTrending(),
    staleTime: 10 * 60 * 1000,  // 10 minutes
    cacheTime: 15 * 60 * 1000,
    retry: 1,
    onSuccess: (data) => {
      if (data?.data) {
        dispatch(setTrendingServices(data.data.trending || []));
      }
    },
    onError: () => {
      dispatch(setTrendingServices(fallbackData.trending));
    }
  });

  return {
    recommendedServices: recommendedServices.length > 0 ? recommendedServices : fallbackData.recommended,
    trendingServices: trendingServices.length > 0 ? trendingServices : fallbackData.trending,
    personalizedSuggestions: personalizedSuggestions.length > 0 ? personalizedSuggestions : fallbackData.personalized,
    isLoading: recommendedQuery.isLoading || trendingQuery.isLoading,
    isError: recommendedQuery.isError,
    refetch: recommendedQuery.refetch
  };
};