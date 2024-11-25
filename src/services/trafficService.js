// src/services/trafficService.js

import axios from 'axios';

export const fetchServiceData = (requestBody) => {
  return axios
    .post('http://localhost:8080/TrafficService', requestBody, {
      headers: { 'Content-Type': 'application/json' },
    })
    .then((response) => response.data)
    .catch((error) => {
      console.error('Error fetching data:', error);
      throw error; // Rethrow the error for further handling
    });
};
