import { useState, useEffect, useCallback } from 'react';
import { productsAPI } from '../api/api';

/**
 * Hook for fetching products from API (db.json via backend)
 * No fake data — all data comes from the backend
 */
export function useProducts(options = {}) {
  const { poll = false, interval = 5000 } = options;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await productsAPI.getAll();
      setProducts(res.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();

    if (poll) {
      const timer = setInterval(fetchProducts, interval);
      return () => clearInterval(timer);
    }
  }, [fetchProducts, poll, interval]);

  return { products, loading, error, refetch: fetchProducts };
}
