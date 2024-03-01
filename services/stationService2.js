const { StatusCodes } = require("http-status-codes");
const asyncHandler = require('express-async-handler');
const stationsModel2=require("../models/stationModel2");

// create station =====================================================================
exports.createStations = asyncHandler(async (req, res) => {
    const stationType = /*req.body.station && req.body.station.type;*/  req.body.station.type;
    const coordinates = /*req.body.station && req.body.station.coordinates;*/  req.body.station.coordinates;
    const StationName = req.body.StationName;

    if (!stationType) {
        return res.status(400).json({ msg: "Path 'station.type' is required." });
    }

    const newStation = await stationsModel2.create({
        station: {
            type: stationType,
            coordinates: coordinates,
        },
        StationName: StationName,
    });

    res.status(StatusCodes.OK).json({
        station: newStation,
    });
});


// update station ===================================================================
exports.updateStation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const type = req.body.station && req.body.station.type;
    const coordinates = req.body.station && req.body.station.coordinates;
    const StationName = req.body.StationName;

    const station = await stationsModel2.findOneAndUpdate(
        { _id: id },
        { type: type, coordinates: coordinates, StationName: StationName },
        { new: true }
    );

    if (!station) {
        res.status(404).json({ msg: `No station for this id ${id}` });
    }
    res.status(200).json({ data: station });
});

//get stations =====================================================================
exports.getStations = asyncHandler(async (req, res) => {
    const stations = await stationsModel2.find({});
    res.status(200).json({ results: stations.length, data: stations });
});

//get  specific station ==========================================================
//GET /api/v1/stations/:name
exports.getStation = asyncHandler(async (req, res) => {

    const name  = req.params.name;
    const station = await stationsModel2.findOne({StationName : name });    //===>> findOne for #name# BUT findById for #ID#
    if (!station) {
    res.status(404).json({ msg: `No station for this name ${name}` });
    }
    res.status(200).json({ data: station });
}); 

// get neareststation

exports.findNearbyStations = async (req, res) => {

    const { userLat, userLong, minDistance, maxDistance } = req.query;

    if (!userLat || !userLong || !minDistance || !maxDistance) {
        return res.status(400).json({ msg: "User latitude, longitude, minDistance, and maxDistance are required." });
    }

    try {
        const stations = await stationsModel2.find({
            "station.coordinates": {
                $near: {
                    $geometry: { type: "Point", coordinates: [parseFloat(userLong), parseFloat(userLat)] },
                    $minDistance: parseInt(minDistance),
                    $maxDistance: parseInt(maxDistance)
                }
            }
        });

        res.status(200).json({ data: stations });
    } catch (error) {
        console.error("Error finding nearby stations:", error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

exports.pinStationOnMap = async (req , res)=>{

   const {StationName, coordinates} = req.body; 
   try {
    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
        throw new Error("Coordinates must be an array with two elements [longitude, latitude].");
    }

    const station = await stationsModel2.create({
        station: {
            type: "Point",
            coordinates: coordinates,
        },
        StationName: `${StationName}`,
    });

    console.log("Station location pinned successfully");
    return res.status(201).json({ message: "Station pinned successfully", station });
} catch (error) {
    console.error(`Error pinning Station on map for Station ${StationName}: ${error.message}`);
    return res.status(500).json({ message: "Internal server error" });
}
};
//delete station ======================================================================
exports.deleteStation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const station = await stationsModel2.findByIdAndDelete(id);

    if (!station) {
    res.status(404).json({ msg: `No station for this id ${id}` });
    }
    res.status(204).send();
});
