import { Platform } from 'react-native';
import type { Maker, Product, RoomDesign } from './types';

const configuredBase = process.env.EXPO_PUBLIC_API_BASE?.replace(/\/+$/, '');
const defaultBase = Platform.OS === 'android'
  ? 'http://10.0.2.2:8000/api'
  : 'http://localhost:8000/api';
export const API_BASE = configuredBase || defaultBase;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { Accept: 'application/json', ...init?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message || 'Something went wrong. Please try again.');
  }
  return response.json() as Promise<T>;
}

export const getProducts = () => request<Product[]>('/products/100');
export const searchProducts = (query: string) => request<Product[]>('/search/filters', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
});
export const getProduct = (slug: string) => request<Product>(`/product/${encodeURIComponent(slug)}`);
export const getMakers = (kind: 'vendors' | 'talents') => request<Maker[]>(`/marketplace/${kind}`);

export async function createRoomDesign(photoUri: string, roomType: string, style: string, budget: number, notes: string) {
  const form = new FormData();
  form.append('roomImage', { uri: photoUri, name: 'room-photo.jpg', type: 'image/jpeg' } as unknown as Blob);
  form.append('roomType', roomType);
  form.append('style', style);
  form.append('budget', String(budget));
  form.append('notes', notes);
  return request<RoomDesign>('/room-design/reimagine', { method: 'POST', body: form });
}