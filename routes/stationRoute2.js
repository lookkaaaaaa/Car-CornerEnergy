const express = require('express');
const router = express.Router();
const authService = require('../services/authServices');
const { getStations, getStation, createStations, updateStation, deleteStation, findNearbyStations,pinStationOnMap } = require('../services/stationService2');

// Middleware for authentication and authorization
const protectAndAuthorize = [authService.protect, authService.allowedTo('admin', 'manager')];

//getNearest
router.route('/nearby').get(findNearbyStations);

// Create station (Admin only)
router.route('/').post(protectAndAuthorize, createStations);

// Get all stations
router.route('/getAllStations').get(getStations);

// Get specific station by name
router.route('/:name').get(getStation);

// Update station by ID
router.route('/:id').put(updateStation);

// Pin station by pin
router.route('/pin-station').post(pinStationOnMap);


// Delete station by ID
router.route('/:id').delete(deleteStation);

module.exports = router;

