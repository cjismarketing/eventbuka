import { useState, useEffect } from 'react';
import { 
  getEvents, 
  getVenues, 
  getSponsors, 
  getPartners, 
  getUserBookings,
  Event,
  Venue,
  Sponsor,
  Partner,
  Booking
} from '../lib/supabase';

// Custom hook for events
export function useEvents(filters?: {
  category?: string;
  location?: string;
  search?: string;
  status?: string;
  limit?: number;
}) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchEvents();
  }, [filters?.category, filters?.location, filters?.search, filters?.status]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getEvents(filters);
      
      if (fetchError) {
        setError(fetchError);
        console.error('Error fetching events:', fetchError);
      } else {
        setEvents(data);
      }
    } catch (err) {
      setError(err);
      console.error('Exception fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchEvents();
  };

  return { events, loading, error, refetch };
}

// Custom hook for venues
export function useVenues(filters?: {
  city?: string;
  capacity?: number;
  available?: boolean;
}) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchVenues();
  }, [filters?.city, filters?.capacity, filters?.available]);

  const fetchVenues = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getVenues(filters);
      
      if (fetchError) {
        setError(fetchError);
        console.error('Error fetching venues:', fetchError);
      } else {
        setVenues(data);
      }
    } catch (err) {
      setError(err);
      console.error('Exception fetching venues:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchVenues();
  };

  return { venues, loading, error, refetch };
}

// Custom hook for sponsors
export function useSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getSponsors();
      
      if (fetchError) {
        setError(fetchError);
        console.error('Error fetching sponsors:', fetchError);
      } else {
        setSponsors(data);
      }
    } catch (err) {
      setError(err);
      console.error('Exception fetching sponsors:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchSponsors();
  };

  return { sponsors, loading, error, refetch };
}

// Custom hook for partners
export function usePartners(serviceType?: string) {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    fetchPartners();
  }, [serviceType]);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getPartners(serviceType);
      
      if (fetchError) {
        setError(fetchError);
        console.error('Error fetching partners:', fetchError);
      } else {
        setPartners(data);
      }
    } catch (err) {
      setError(err);
      console.error('Exception fetching partners:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchPartners();
  };

  return { partners, loading, error, refetch };
}

// Custom hook for user bookings
export function useUserBookings(userId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchBookings = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await getUserBookings(userId);
      
      if (fetchError) {
        setError(fetchError);
        console.error('Error fetching bookings:', fetchError);
      } else {
        setBookings(data);
      }
    } catch (err) {
      setError(err);
      console.error('Exception fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    if (userId) {
      fetchBookings();
    }
  };

  return { bookings, loading, error, refetch };
}

// Custom hook for real-time subscriptions
export function useRealtimeSubscription(table: string, callback: (payload: any) => void) {
  useEffect(() => {
    const subscription = supabase
      .channel(`realtime-${table}`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        callback
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, callback]);
}