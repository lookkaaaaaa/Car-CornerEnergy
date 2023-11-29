const express=require('express');
const{getLocations}=require('../services/LocationServices');
const router = express.Router();

router.post('/',getLocations);

module.exports=router;