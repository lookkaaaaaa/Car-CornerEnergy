const mongoose = require('mongoose');

//..createSchema
const UserSchema=new mongoose.Schema({
    name: {
        type: String,
        required: [true , 'name is required'],
    },

    email: {
        type: String,
        required: [true, 'email is required'],
        unique: [true, 'this email is already in use' ],
    },

    password: {
        type: String,
        required: [true , 'password is required'],
        minlength: [8 , 'password must contain numbers and letters and atleast 8 letters'],
    },

    
}, {timestamps: true}           //for createdAt & updatedAt
);

//..createModel
const UserModel=mongoose.model("user",UserSchema);
module.exports =UserModel;