const express=require('express');

const router = express.Router();


const {
    getLocations,
    getLocation,
    createLocations,
    updateLocation,
    deleteLocation,
    }  =require('../services/LocationServices');
    
    router.route('/').post(createLocations).get(getLocations);

    router.route('/:name').get(getLocation)
    
    router.route('/:id').put(updateLocation).delete(deleteLocation);
    

module.exports=router;