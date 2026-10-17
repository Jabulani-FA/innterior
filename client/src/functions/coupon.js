import axios from 'axios';
import { apiBase } from './api';

export const getCoupons = async () => 
    await axios.get(`${apiBase}/coupons`);

export const getCoupon = async (slug) => 
    await axios.get(`${apiBase}/coupon/${slug}`);

export const removeCoupon = async (slug, authtoken) => 
    await axios.delete(`${apiBase}/coupon/${slug}`, {
        headers: {
            authtoken
        }
    });

export const updateCoupon = async (slug, coupon, authtoken) => 
    await axios.put(`${apiBase}/coupon/${slug}`, coupon,
    {
        headers: {
            authtoken
        }
    });

export const createCoupon = async (coupon, authtoken) => 
    await axios.post(`${apiBase}/coupon`, coupon,
    {
        headers: {
            authtoken
        }
    });
