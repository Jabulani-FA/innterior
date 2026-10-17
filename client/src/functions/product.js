import axios from 'axios';

const apiBase = process.env.REACT_APP_API_BASE || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000/api'
    : 'https://innteriors-backend.onrender.com/api'
);

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