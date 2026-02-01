import express from 'express';
import { getAccessToken, getCountries, getStates, getCities } from '../controllers/location-controller.js';

const router = express.Router();

// Get access token for location API
router.get('/auth-token', getAccessToken);

// Get all countries
router.get('/countries', getCountries);

// Get states by country
router.get('/states/:country', getStates);

// Get cities by state
router.get('/cities/:state', getCities);

export default router;
