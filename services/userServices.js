const { StatusCodes } = require("http-status-codes");
const asyncHandler = require('express-async-handler');
const UserModel=require("../models/userModel");
exports.getUsers=asyncHandler( async(req,res)=>{
    const name=req.body.name;
    console.log(req.body);
    
    const newUser = await UserModel.create(req.body);
    res.status(StatusCodes.OK).json({
        user:newUser
    });
});