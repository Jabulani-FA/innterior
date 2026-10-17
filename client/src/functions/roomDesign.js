import axios from 'axios';
import { apiBase } from './api';

export const createRoomDesign = async (formData) => {
  const response = await axios.post(`${apiBase}/room-design/reimagine`, formData, {
    timeout: 180000,
  });
  return response.data;
};