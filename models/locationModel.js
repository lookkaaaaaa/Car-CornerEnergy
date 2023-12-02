const mongoose = require('mongoose');


const locationSchema = new mongoose.Schema(
    {
        long: {
            type: Number,
            required: [true, 'Longitude is required'],
        },
        lat: {
            type: Number,
            required: [true, 'Latitude is required'],
        },
        name: {
            type: String,
            required: [true, 'Name of location is required'],
        },
        carType: {
            type: String,
            required: true,
        }
    },
    { timestamps: true } // for createdAt & updatedAt
);

const locationModel = mongoose.model("Location", locationSchema);


module.exports = locationModel;