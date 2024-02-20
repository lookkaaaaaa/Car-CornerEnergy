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

exports.getNearestStation = asyncHandler(async (req, res) => {
    return "test";
    const { userLat, userLong } = req.query;
    if (!userLat || !userLong) {
        
        return res.status(400).json({ msg: "User latitude and longitude are required." });
    }

    const stations = await stationsModel2.find({});
    if (stations.length === 0) {
        return res.status(404).json({ msg: "No stations found." });
    }

    let nearestStation = null;
    let maxCosineSimilarity = -Infinity;

    stations.forEach(station => {
        const stationVector = [station.coordinates[0], station.coordinates[1]]; // Latitude and longitude as vector
        const userVector = [parseFloat(userLat), parseFloat(userLong)]; // User's location as vector

        const cosineSimilarity = calculateCosineSimilarity(stationVector, userVector);
        
        if (cosineSimilarity > maxCosineSimilarity) {
            maxCosineSimilarity = cosineSimilarity;
            nearestStation = station;
        }
    });

    if (!nearestStation) {
        return res.status(404).json({ msg: "No nearest station found." });
    }

    res.status(StatusCodes.OK).json({ data: nearestStation, cosineSimilarity: maxCosineSimilarity });
});

function calculateCosineSimilarity(vector1, vector2) {
    // Calculate dot product
    let dotProduct = 0;
    for (let i = 0; i < vector1.length; i++) {
        dotProduct += vector1[i] * vector2[i];
    }

    // Calculate magnitudes
    const magnitude1 = Math.sqrt(vector1.reduce((sum, value) => sum + Math.pow(value, 2), 0));
    const magnitude2 = Math.sqrt(vector2.reduce((sum, value) => sum + Math.pow(value, 2), 0));

    // Calculate cosine similarity
    return dotProduct / (magnitude1 * magnitude2);
}
//delete station ======================================================================
exports.deleteStation = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const station = await stationsModel2.findByIdAndDelete(id);

    if (!station) {
    res.status(404).json({ msg: `No station for this id ${id}` });
    }
    res.status(204).send();
});
