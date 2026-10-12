import axios from 'axios';

const apiBase = process.env.REACT_APP_API_BASE || (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000/api'
    : 'https://innteriors-backend.onrender.com/api'
);

export const createRoomDesign = async (formData) => {
  const response = await axios.post(`${apiBase}/room-design/reimagine`, formData, {
    timeout: 180000,
  });
  return response.data;
};