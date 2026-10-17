import axios from 'axios';
import { apiBase } from './api';

export const createProduct = async (product, authtoken) => 
   await axios.post(`${apiBase}/product`, product, 
    {
        headers: {
            authtoken
        }
    });

export const updateProduct = async (slug, product, authtoken) => 
    await axios.put(`${apiBase}/product/${slug}`, product, 
    {
        headers: {
            authtoken
        }
    });

export const getProductsByCount = async(count) =>
    await axios.get(`${apiBase}/products/${count}`)

export const removeProduct = async (slug, authtoken) =>
    await axios.delete(`${apiBase}/product/${slug}`, {
        headers:{
            authtoken,
        },
    })

export const getProduct = async(slug) =>
    await axios.get(`${apiBase}/product/${slug}`)

export const getProducts = async(sort,order,page) =>
    await axios.post(`${apiBase}/products`,{
        sort,
        order,
        page,
    })

export const getProductsCount = async() =>
    await axios.get(`${apiBase}/products/total`)

export const productStar = async (productId, star, authtoken) =>
    await axios.put(`${apiBase}/product/star/${productId}`, 
    { star }, 
    {
        headers: {
            authtoken,
        }
    })

export const getRelated = async(productId) =>
    await axios.get(`${apiBase}/product/related/${productId}`)

export const fetchProductByFilter = async(arg) =>
    await axios.post(`${apiBase}/search/filters`, arg)