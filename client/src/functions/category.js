import axios from 'axios';

const apiBase = process.env.REACT_APP_API_BASE || (
    window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:8000/api'
        : 'https://innteriors-backend.onrender.com/api'
);

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
