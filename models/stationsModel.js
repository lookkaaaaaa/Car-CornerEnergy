const mongoose = require('mongoose');


const stationsSchema = new mongoose.Schema(
    {
        long: {
            type: Number,
            required: [true, 'Longitude is required'],
        },
        lat: {
            type: Number,
            required: [true, 'Latitude is required'],
        },
       StationName: {
            type: String,
            required: true,
        }
    },
    { timestamps: true } // for createdAt & updatedAt
);

const stationsModel = mongoose.model("stations", stationsSchema);


module.exports = stationsModel;