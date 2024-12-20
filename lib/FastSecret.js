import { EXPO_CLIENT_ID, EXPO_CLIENT_SECRET, EXPO_BASE_URL_PATH } from '@env';
import axios from 'axios';

const clientId = process.env.EXPO_CLIENT_ID;
const clientSecret = process.env.EXPO_CLIENT_SECRET;

const authorize = async () => {
  try {
    const response = await axios({
      method: 'POST',
      url: 'https://oauth.fatsecret.com/connect/token',
      auth: {
        username: clientId,
        password: clientSecret
      },
      headers: { 'content-type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        'grant_type': 'client_credentials',
        'scope': 'premier'
      })
    });

    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Authorization error:', error);
    throw error;
  }
};

const apiCall = async (method, endpoint, params = {}) => {
  try {
    const token = await authorize();
    const url = `${EXPO_BASE_URL_PATH}${endpoint}`;
    
    const config = {
      method: method,
      url: url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.access_token}`
      }
    };

    if (method.toUpperCase() === 'GET') {
      config.params = params;
    } else {
      config.data = params;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

export { authorize, apiCall };
