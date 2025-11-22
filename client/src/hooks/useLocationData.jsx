import { useState, useEffect } from 'react';
import axios from 'axios';

const API_TOKEN = import.meta.env.VITE_LOCATION_API;
const BASE_URL = 'https://www.universal-tutorial.com/api';

export const useLocationData = () => {
  const [authToken, setAuthToken] = useState('');
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    getAuthToken();
  }, []);

  const getAuthToken = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/getaccesstoken`, {
        headers: {
          "Accept": "application/json",
          "api-token": API_TOKEN,
          "user-email": "abhishekyadav7102004@gmail.com"
        }
      });
      setAuthToken(response.data.auth_token);
      fetchCountries(response.data.auth_token);
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
  };

  const fetchCountries = async (token) => {
    try {
      const response = await axios.get(`${BASE_URL}/countries/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        }
      });
      setCountries(response.data);
    } catch (error) {
      console.error('Error fetching countries:', error);
    }
  };

  const fetchStates = async (country) => {
    try {
      const response = await axios.get(`${BASE_URL}/states/${country}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Accept": "application/json"
        }
      });
      setStates(response.data);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (state) => {
    try {
      const response = await axios.get(`${BASE_URL}/cities/${state}`, {
        headers: {
          "Authorization": `Bearer ${authToken}`,
          "Accept": "application/json"
        }
      });
      setCities(response.data);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedState('');
    setSelectedCity('');
    setCities([]);
    fetchStates(value);
  };

  const handleStateChange = (value) => {
    setSelectedState(value);
    setSelectedCity('');
    fetchCities(value);
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
  };

  return {
    countries,
    states,
    cities,
    selectedCountry,
    selectedState,
    selectedCity,
    handleCountryChange,
    handleStateChange,
    handleCityChange
  };
};