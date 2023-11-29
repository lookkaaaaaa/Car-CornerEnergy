const { StatusCodes } = require("http-status-codes");
const asyncHandler = require('express-async-handler');
const LocationModel=require("../models/locationModel");
exports.getLocations=asyncHandler( async(req,res)=>{
    const name=req.body.name;
    console.log(req.body);
    
    const newLocation = await LocationModel.create(req.body);
    res.status(StatusCodes.OK).json({
        location:newLocation
    });
});