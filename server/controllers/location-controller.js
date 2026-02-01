import axios from 'axios';

const LOCATION_API_BASE = 'https://www.universal-tutorial.com/api';
const LOCATION_API_TOKEN = process.env.LOCATION_API_TOKEN;
const LOCATION_API_EMAIL = process.env.LOCATION_API_EMAIL;

// Cache for auth token to avoid repeated requests
let cachedAuthToken = null;
let tokenExpiryTime = null;

export const getAccessToken = async (req, res) => {
  try {
    // Return cached token if still valid (cache for 1 hour)
    if (cachedAuthToken && tokenExpiryTime && new Date() < tokenExpiryTime) {
      return res.status(200).json({ auth_token: cachedAuthToken });
    }

    const response = await axios.get(`${LOCATION_API_BASE}/getaccesstoken`, {
      headers: {
        "Accept": "application/json",
        "api-token": LOCATION_API_TOKEN,
        "user-email": LOCATION_API_EMAIL
      }
    });

    cachedAuthToken = response.data.auth_token;
    tokenExpiryTime = new Date(new Date().getTime() + 60 * 60 * 1000); // 1 hour

    res.status(200).json({ auth_token: response.data.auth_token });
  } catch (error) {
    console.error('Error getting location API token:', error.message);
    res.status(500).json({ message: 'Failed to get access token', error: error.message });
  }
};

export const getCountries = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(400).json({ message: 'Authorization token required' });
    }

    const response = await axios.get(`${LOCATION_API_BASE}/countries/`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching countries:', error.message);
    res.status(500).json({ message: 'Failed to fetch countries', error: error.message });
  }
};

export const getStates = async (req, res) => {
  try {
    const { country } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'Authorization token required' });
    }

    if (!country) {
      return res.status(400).json({ message: 'Country parameter required' });
    }

    const response = await axios.get(`${LOCATION_API_BASE}/states/${country}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching states:', error.message);
    res.status(500).json({ message: 'Failed to fetch states', error: error.message });
  }
};

export const getCities = async (req, res) => {
  try {
    const { state } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(400).json({ message: 'Authorization token required' });
    }

    if (!state) {
      return res.status(400).json({ message: 'State parameter required' });
    }

    const response = await axios.get(`${LOCATION_API_BASE}/cities/${state}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching cities:', error.message);
    res.status(500).json({ message: 'Failed to fetch cities', error: error.message });
  }
};
