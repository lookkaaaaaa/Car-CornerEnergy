const { StatusCodes } = require("http-status-codes");
const asyncHandler = require('express-async-handler');
const stationsModel=require("../models/stationsModel");
//create station =====================================================================
exports.createStations=asyncHandler( async(req,res)=>{
    const long =req.body.long;
    const lat =req.body.lat;
    const StationName =req.body.StationName;

    const newStation= await stationsModel.create(req.body);
    res.status(StatusCodes.OK).json({
        station: newStation
    });
}); 

//get stations =====================================================================
exports.getStations = asyncHandler(async (req, res) => {
    const stations = await stationsModel.find({});
    res.status(200).json({ results: stations.length, data: stations });
});

//get  specific station ==========================================================
//GET /api/v1/stations/:name
exports.getStation = asyncHandler(async (req, res) => {

    const name  = req.params.name;
    const station = await stationsModel.findOne({StationName : name });    //===>> findOne for #name# BUT findById for #ID#
    if (!station) {
    res.status(404).json({ msg: `No station for this name ${name}` });
    }
    res.status(200).json({ data: station });
}); 

// update station ===================================================================
//PUT /api/v1/stations/:id
exports.updateStation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const long  = req.body.long;
    const lat  = req.body.lat;
    const StationName = req.body.StationName;

    const station = await stationsModel.findOneAndUpdate(
    { _id: id },
    { long : long, lat : lat , StationName: StationName },
    { new: true }
    );
    if (!station) {
    res.status(404).json({ msg: `No station for this id ${id}` });
    }
    res.status(200).json({ data: station });
});
//delete station ======================================================================
exports.deleteStation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const station = await stationsModel.findByIdAndDelete(id);

    if (!station) {
    res.status(404).json({ msg: `No station for this id ${id}` });
    }
    res.status(204).send();
});