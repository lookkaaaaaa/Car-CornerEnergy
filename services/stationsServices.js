const { StatusCodes } = require("http-status-codes");
const asyncHandler = require('express-async-handler');
const stationsModel=require("../models/stationsModel");
exports.getstations=asyncHandler( async(req,res)=>{
    const name=req.body.name;
    console.log(req.body);
    
    const newstations = await stationsModel.create(req.body);
    res.status(StatusCodes.OK).json({
       stations: newstations
    });
});