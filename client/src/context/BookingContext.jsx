import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';

const BookingContext = createContext(null);
const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const BookingProvider = ({ children }) => {
  const [sports, setSports] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);

  const fetchSports = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/sports`);
      setSports(data.sports);
      return data.sports;
    } catch (err) {
      console.error('fetchSports error', err);
      return [];
    }
  }, []);

  const fetchMyBookings = useCallback(async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const { data } = await axios.get(`${API_BASE}/bookings/my?${params}`);
      setBookings(data.bookings);
      return data.bookings;
    } catch (err) {
      console.error('fetchMyBookings error', err);
      return [];
    }
  }, []);

  const fetchAvailableSlots = useCallback(async (sportId, date) => {
    setSlotsLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/bookings/slots`, {
        params: { sportId, date },
      });
      return data;
    } catch (err) {
      console.error('fetchAvailableSlots error', err);
      return { slots: [], blockedByEvent: false, eventName: null };
    } finally {
      setSlotsLoading(false);
    }
  }, []);

  const createBooking = useCallback(async (payload) => {
    const { data } = await axios.post(`${API_BASE}/bookings`, payload);
    return data;
  }, []);

  const cancelBooking = useCallback(async (bookingId) => {
    const { data } = await axios.patch(`${API_BASE}/bookings/${bookingId}/cancel`);
    return data;
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/events`);
      setEvents(data.events);
      return data.events;
    } catch (err) {
      console.error('fetchEvents error', err);
      return [];
    }
  }, []);

  return (
    <BookingContext.Provider value={{
      sports, bookings, events, slotsLoading,
      fetchSports, fetchMyBookings, fetchAvailableSlots,
      createBooking, cancelBooking, fetchEvents,
    }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be used within BookingProvider');
  return ctx;
};
