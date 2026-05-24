import axios, { AxiosError } from 'axios';

const EOSDA_API_KEY = process.env.EOSDA_API_KEY;

if (!EOSDA_API_KEY) {
  console.error(
    'FATAL ERROR: EOSDA_API_KEY is not set on the server. Shutting down.'
  );
}

export const eosdaServerClient = axios.create({
  baseURL: 'https://api-connect.eos.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

eosdaServerClient.interceptors.request.use(
  (config) => {
    if (EOSDA_API_KEY) {
      config.headers['x-api-key'] = EOSDA_API_KEY;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

eosdaServerClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('EOSDA API Error:', error.response?.data);

    const errorResponse = {
      status: error.response?.status || 500,
      data: error.response?.data || { message: 'Internal server error' },
    };

    return Promise.reject(errorResponse);
  }
);
