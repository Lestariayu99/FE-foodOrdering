import { config } from '../../config';
import axios from 'axios';

export const getAddress = async () => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  const token = auth ? auth.token : null;

  return await axios.get(`${config.api_host}/api/delivery-addresses?limit=10`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


export const getLocation = async (lokasi, kodeInduk) => {
  
  return await axios.get(`https://www.emsifa.com/api-wilayah-indonesia/${lokasi}?kode_induk=${kodeInduk}`);

}

export const createAddress = async data => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  const token = auth ? auth.token : null;

  return await axios.post(`${config.api_host}/api/delivery-addresses`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
