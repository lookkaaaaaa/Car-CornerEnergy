const express=require('express');
const{getstations}=require('../services/stationsServices');
const router = express.Router();

router.post('/',getstations);

module.exports=router;