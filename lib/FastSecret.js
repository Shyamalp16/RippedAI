import { CLIENT_ID, CLIENT_SECRET, BASE_URL_PATH } from '@env';
import axios from 'axios';

const clientId = CLIENT_ID;
const clientSecret = CLIENT_SECRET;

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
        'scope': 'basic'
      })
    });

    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Authorization error:', error);
    throw error;
  }
};

const apiCall = async (endpoint, method, data) => {
  const token = await authorize();
  const response = await axios({
    method: method,
    url: `${BASE_URL_PATH}${endpoint}`,
    headers: {
      'content-type': 'application/json',
      'Authorization': `Bearer ${token.access_token}`
    },
    data: data
  });

  // The 'data' field in the axios configuration object is used to send data with the request.
  // For GET requests, this data is typically converted to URL parameters.
  // For POST, PUT, PATCH requests, this data is sent in the request body.
  // The 'data' parameter allows the function to be flexible, accepting different data
  // for different types of API calls without changing the function signature.
  return response.data;
};
export { authorize, apiCall};
