import { useState, useEffect, useCallback } from 'react';
import { ordersAPI } from '../api/api';
import socket from '../utils/socket';

/**
 * Hook for fetching and managing orders with Real-time Sockets + Polling Fallback
 * @param {Object} options - { poll: boolean, interval: number, status: string }
 */
export function useOrders(options = {}) {
  const { poll = true, interval = 10000, status = '' } = options; // Relaxed polling because we have sockets
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const params = status ? `status=${status}` : '';
      const res = await ordersAPI.getAll(params);
      setOrders(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    fetchOrders();

    // Listen for real-time updates
    socket.on('order_created', (newOrder) => {
      console.log('  🔔 Real-time Order Created:', newOrder.id);
      fetchOrders();
    });

    socket.on('order_updated', (updatedOrder) => {
      console.log('  🔔 Real-time Order Updated:', updatedOrder.id);
      fetchOrders();
    });

    if (poll) {
      // Reduced interval since we have sockets
      const timer = setInterval(fetchOrders, interval);
      return () => {
        clearInterval(timer);
        socket.off('order_created');
        socket.off('order_updated');
      };
    }

    return () => {
      socket.off('order_created');
      socket.off('order_updated');
    };
  }, [fetchOrders, poll, interval]);

  return { orders, loading, error, refetch: fetchOrders };
}
