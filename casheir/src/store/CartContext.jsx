import { createContext, useContext, useReducer, useMemo, useCallback } from 'react';

const CartContext = createContext(null);
const CartDispatchContext = createContext(null);

const ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  CLEAR_CART: 'CLEAR_CART',
};

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD_ITEM: {
      const product = action.payload;
      const productId = Number(product.id);

      // Guard: validate product data
      if (!productId || !product.name || typeof product.price !== 'number' || product.price <= 0) {
        console.warn('Invalid product data, ignoring add:', product);
        return state;
      }

      const existingIndex = state.items.findIndex((item) => item.productId === productId);

      if (existingIndex >= 0) {
        // Same product → increment qty (prevent duplicates)
        const newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          qty: newItems[existingIndex].qty + 1,
        };
        return { ...state, items: newItems };
      }

      // New product → add with qty=1
      return {
        ...state,
        items: [
          ...state.items,
          {
            productId,
            name: product.name,
            price: product.price,
            image: product.image || null,
            qty: 1,
          },
        ],
      };
    }

    case ACTIONS.INCREMENT: {
      const pid = Number(action.payload);
      return {
        ...state,
        items: state.items.map((item) =>
          item.productId === pid ? { ...item, qty: item.qty + 1 } : item
        ),
      };
    }

    case ACTIONS.DECREMENT: {
      const pid = Number(action.payload);
      const item = state.items.find((i) => i.productId === pid);
      if (!item) return state;

      // If qty would become <= 0, remove the item
      if (item.qty <= 1) {
        return {
          ...state,
          items: state.items.filter((i) => i.productId !== pid),
        };
      }

      return {
        ...state,
        items: state.items.map((i) =>
          i.productId === pid ? { ...i, qty: i.qty - 1 } : i
        ),
      };
    }

    case ACTIONS.REMOVE_ITEM: {
      const pid = Number(action.payload);
      return {
        ...state,
        items: state.items.filter((item) => item.productId !== pid),
      };
    }

    case ACTIONS.CLEAR_CART:
      return { ...state, items: [] };

    default:
      return state;
  }
}

const initialState = { items: [] };

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const total = useMemo(
    () =>
      Math.round(
        state.items.reduce((sum, item) => sum + (item.price || 0) * (item.qty || 0), 0) * 100
      ) / 100,
    [state.items]
  );

  const itemCount = useMemo(
    () => state.items.reduce((sum, item) => sum + (item.qty || 0), 0),
    [state.items]
  );

  const value = useMemo(
    () => ({ items: state.items, total, itemCount }),
    [state.items, total, itemCount]
  );

  return (
    <CartContext.Provider value={value}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}

export function useCartDispatch() {
  const dispatch = useContext(CartDispatchContext);
  if (!dispatch)
    throw new Error('useCartDispatch must be used within CartProvider');

  const addItem = useCallback(
    (product) => dispatch({ type: ACTIONS.ADD_ITEM, payload: product }),
    [dispatch]
  );
  const increment = useCallback(
    (productId) => dispatch({ type: ACTIONS.INCREMENT, payload: productId }),
    [dispatch]
  );
  const decrement = useCallback(
    (productId) => dispatch({ type: ACTIONS.DECREMENT, payload: productId }),
    [dispatch]
  );
  const removeItem = useCallback(
    (productId) => dispatch({ type: ACTIONS.REMOVE_ITEM, payload: productId }),
    [dispatch]
  );
  const clearCart = useCallback(
    () => dispatch({ type: ACTIONS.CLEAR_CART }),
    [dispatch]
  );

  return { addItem, increment, decrement, removeItem, clearCart };
}
