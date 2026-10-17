import axios from 'axios';

const apiBase = process.env.REACT_APP_API_BASE || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000/api'
    : 'https://innteriors-backend.onrender.com/api'
);
const withToken = (authtoken) => ({ headers: { authtoken } });

export const roleApplication = async (authtoken, form) => (
  await axios.post(`${apiBase}/application`, form, withToken(authtoken))
);

export const getMyApplications = async (authtoken) => (
  await axios.get(`${apiBase}/application/mine`, withToken(authtoken))
);

export const getApplicationsForReview = async (authtoken) => (
  await axios.get(`${apiBase}/admin/applications`, withToken(authtoken))
);

export const roleApplicationDecision = async (authtoken, id, decision) => (
  await axios.patch(`${apiBase}/admin/application/${id}`, decision, withToken(authtoken))
);

export const getMarketplaceProfile = async (authtoken) => (
  await axios.get(`${apiBase}/marketplace/profile`, withToken(authtoken))
);

export const updateMarketplaceProfile = async (authtoken, profile) => (
  await axios.patch(`${apiBase}/marketplace/profile`, profile, withToken(authtoken))
);

export const getVendorProducts = async (authtoken) => (
  await axios.get(`${apiBase}/vendor/products`, withToken(authtoken))
);

export const getPublicMakers = async (kind) => (
  await axios.get(`${apiBase}/marketplace/${kind}`)
);

export const getPublicVendorProducts = async (vendorId) => (
  await axios.get(`${apiBase}/marketplace/vendors/${vendorId}/products`)
);
