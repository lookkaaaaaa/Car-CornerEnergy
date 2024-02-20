const express = require('express');
const router = express.Router();
const authService = require('../services/authServices');
const { getStations, getStation, createStations, updateStation, deleteStation,getNearestStation} = require('../services/stationService2');

// Middleware for authentication and authorization
const protectAndAuthorize = [authService.protect, authService.allowedTo('admin', 'manager')];


// Create station (Admin only)
router.route('/').post(protectAndAuthorize, createStations);

// Get all stations
//router.route('/getAllStations').get(getStations);

// Get specific station by name
//router.route('/:name').get(getStation);

// Update station by ID
router.route('/:id').put(updateStation);

// Delete station by ID
router.route('/:id').delete(deleteStation);

//getNearest
router.route('/nearestStation').get(getNearestStation);
module.exports = router;
