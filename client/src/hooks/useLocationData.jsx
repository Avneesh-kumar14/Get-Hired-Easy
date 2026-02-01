import { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

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
      const response = await axios.get(`${BACKEND_URL}/location/auth-token`);
      setAuthToken(response.data.auth_token);
      fetchCountries(response.data.auth_token);
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
  };

  const fetchCountries = async (token) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/location/countries`, {
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
      const response = await axios.get(`${BACKEND_URL}/location/states/${country}`, {
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
      const response = await axios.get(`${BACKEND_URL}/location/cities/${state}`, {
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