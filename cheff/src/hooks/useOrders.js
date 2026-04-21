import { useState, useEffect, useCallback, useRef } from 'react';
import { ordersAPI } from '../api/api';
import socket from '../utils/socket';

/**
 * Polling hook for kitchen orders + Socket events
 * Only shows pending + cooking orders (active kitchen queue)
 * Sorted by createdAt ascending (oldest first = cook first)
 */
export function useOrders(options = {}) {
  const { interval = 10000 } = options;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await ordersAPI.getAll();
      if (!mountedRef.current) return;

      // Filter: chef sees pending + cooking orders (active queue)
      const kitchenOrders = (res.data || [])
        .filter((o) => o.status === 'pending' || o.status === 'cooking')
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); // oldest first

      setOrders(kitchenOrders);
      setError(null);
    } catch (err) {
      if (mountedRef.current) setError(err.message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchOrders();

    socket.on('order_created', (newOrder) => {
      console.log('  🍳 Chef: New order received!', newOrder.id);
      fetchOrders();
    });

    socket.on('order_updated', () => {
      fetchOrders();
    });

    const timer = setInterval(fetchOrders, interval);
    return () => {
      mountedRef.current = false;
      clearInterval(timer);
      socket.off('order_created');
      socket.off('order_updated');
    };
  }, [fetchOrders, interval]);

  return { orders, loading, error, refetch: fetchOrders };
}

/**
 * Hook for all orders (including ready) for history view
 */
export function useAllOrders(options = {}) {
  const { interval = 15000 } = options;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await ordersAPI.getAll();
      const all = (res.data || [])
        .filter((o) => ['pending', 'cooking', 'ready'].includes(o.status))
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setOrders(all);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    fetchOrders();
    
    socket.on('order_created', fetchOrders);
    socket.on('order_updated', fetchOrders);

    const timer = setInterval(fetchOrders, interval);
    return () => {
      clearInterval(timer);
      socket.off('order_created');
      socket.off('order_updated');
    };
  }, [fetchOrders, interval]);

  return { orders, loading, refetch: fetchOrders };
}
