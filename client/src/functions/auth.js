import axios from 'axios';
import { apiBase } from './api';

export const createOrUpdateUser = async (authtoken) => {
  return await axios.post(`${apiBase}/create-or-update-user`,
  {},
  {
    headers: {
      authtoken
    },
  })
}

export const currentUser = async (authtoken) => {
  return await axios.post(`${apiBase}/current-user`,
  {},
  {
    headers: {
      authtoken,
    },
  })
}
export const currentAdmin = async (authtoken) => {
  return await axios.post(`${apiBase}/current-admin`,
  {},
  {
    headers: {
      authtoken,
    },
  })
}