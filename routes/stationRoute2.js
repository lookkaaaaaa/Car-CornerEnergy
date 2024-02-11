const express=require('express');
const router = express.Router();

const {
    getStations,
    getStation,
    createStations,
    updateStation,
    deleteStation,
    }  =require('../services/stationService2');


    const authService = require('../services/authServices');
//1. authService.protect===> elly hy3ml create lazm ykon logged in 
//2. authService.allowedTo('admin', 'manager')   ===> lazm Admin 
    router.route('/').post(authService.protect, authService.allowedTo('admin', 'manager') ,createStations); //Admin

    router.route('/').get(getStations);
    router.route('/:name').get( getStation,); 
    router.route('/:id').put(updateStation).delete(deleteStation);

module.exports=router;
