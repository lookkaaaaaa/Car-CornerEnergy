const mongoose = require('mongoose');


const locationSchema = new mongoose.Schema(
    {
        coordinates : {
            type : [Number]
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