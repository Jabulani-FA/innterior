import axios from 'axios';
import { apiBase } from './api';

export const getCategories = async () => await axios.get(`${apiBase}/categories`);

export const getCategory = async (slug) => await axios.get(`${apiBase}/category/${slug}`);

export const removeCategory = async (slug, authtoken) => await axios.delete(`${apiBase}/category/${slug}`, {
    headers: { authtoken },
});

export const updateCategory = async (slug, category, authtoken) => await axios.put(`${apiBase}/category/${slug}`, category, {
    headers: { authtoken },
});

export const createCategory = async (category, authtoken) => await axios.post(`${apiBase}/category`, category, {
    headers: { authtoken },
});

export const getCategorySubs = async (_id) => await axios.get(`${apiBase}/category/subs/${_id}`);
