import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProducts } from './api';
import type { Product } from './types';

type StoreValue = {
  products: Product[];
  cart: Product[];
  loading: boolean;
  error: string;
  addToCart: (product: Product) => void;
  changeQuantity: (id: string, amount: number) => void;
  removeFromCart: (id: string) => void;
  refresh: () => Promise<void>;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: React.PropsWithChildren) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      setProducts(await getProducts());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Products could not be loaded.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    AsyncStorage.getItem('innterior.cart').then((stored) => {
      if (stored) setCart(JSON.parse(stored));
    }).catch(() => undefined);
  }, []);

  const save = (next: Product[]) => {
    setCart(next);
    AsyncStorage.setItem('innterior.cart', JSON.stringify(next)).catch(() => undefined);
  };

  const addToCart = (product: Product) => {
    const found = cart.find((item) => item._id === product._id);
    save(found
      ? cart.map((item) => item._id === product._id ? { ...item, count: (item.count || 1) + 1 } : item)
      : [...cart, { ...product, count: 1 }]);
  };

  const changeQuantity = (id: string, amount: number) => save(cart.map((item) => item._id === id
    ? { ...item, count: Math.max(1, (item.count || 1) + amount) }
    : item));

  const removeFromCart = (id: string) => save(cart.filter((item) => item._id !== id));

  return <StoreContext.Provider value={{ products, cart, loading, error, addToCart, changeQuantity, removeFromCart, refresh }}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore must be used inside StoreProvider');
  return value;
}