const { StatusCodes } = require("http-status-codes");
const asyncHandler = require('express-async-handler');
const LocationModel=require("../models/locationModel");


//create location =====================================================================
exports.createLocations=asyncHandler( async(req,res)=>{
    const long =req.body.long;
    const lat =req.body.lat;
    const name =req.body.name;
    const carType =req.body.carType;

    const newLocation= await LocationModel.create(req.body);
    res.status(StatusCodes.OK).json({
        location: newLocation
    });
}); 

//get locations =====================================================================
exports.getLocations = asyncHandler(async (req, res) => {
    const locations = await LocationModel.find({});
    res.status(200).json({ results: locations.length, data: locations });
});

//get  specific location ==========================================================
//GET /api/v1/locations/:name
exports.getLocation = asyncHandler(async (req, res) => {

    const name  = req.params.name;
    const location = await LocationModel.findOne({name : name });    //===>> findOne for #name# BUT findById for #ID#
    if (!location) {
    res.status(404).json({ msg: `No location for this name ${name}` });
    }
    res.status(200).json({ data: location });
}); 

// update location ===================================================================
//PUT /api/v1/locations/:id
exports.updateLocation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const long  = req.body.long;
    const lat  = req.body.lat;
    const name = req.body.name;

    const location = await LocationModel.findOneAndUpdate(
    { _id: id },
    { name : name , long : long, lat : lat },
    { new: true }
    );
    if (!location) {
    res.status(404).json({ msg: `No location for this id ${id}` });
    }
    res.status(200).json({ data: location });
});
//delete user ======================================================================
exports.deleteLocation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const location = await LocationModel.findByIdAndDelete(id);

    if (!location) {
    res.status(404).json({ msg: `No location for this id ${id}` });
    }
    res.status(204).send();
});