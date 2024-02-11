const mongoose = require('mongoose');


const stationsSchema2 = new mongoose.Schema(
    {
        station :{
            type :{
                type : String,
                required : true
            },
            coordinates : {
                type : [Number]
            }
        },
        
        StationName: {
            type: String,
            required: true,
        }
    }
    );

    
    const stationsModel2 = mongoose.model("stations", stationsSchema2);
    module.exports = stationsModel2;