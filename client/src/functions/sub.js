import axios from 'axios';
import { apiBase } from './api';

export const getSubs = async () => await axios.get(`${apiBase}/subs`);

export const getSub = async (slug) => await axios.get(`${apiBase}/sub/${slug}`);

export const removeSub = async (slug, authtoken) => await axios.delete(`${apiBase}/sub/${slug}`, {
    headers: { authtoken },
});

export const updateSub = async (slug, sub, authtoken) => await axios.put(`${apiBase}/sub/${slug}`, sub, {
    headers: { authtoken },
});

export const createSub = async (sub, authtoken) => await axios.post(`${apiBase}/sub`, sub, {
    headers: { authtoken },
});



