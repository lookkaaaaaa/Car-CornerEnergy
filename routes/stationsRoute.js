const express=require('express');
const router = express.Router();

const {
    getStations,
    getStation,
    createStations,
    updateStation,
    deleteStation,
    }  =require('../services/stationsServices');
    
    router.route('/').post(createStations).get(getStations);

    router.route('/:name').get( getStation,)
    
    router.route('/:id').put(updateStation).delete(deleteStation);
    

module.exports=router;