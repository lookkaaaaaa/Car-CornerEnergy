const { StatusCodes } = require ("http-status-codes");
const asyncHandler = require('express-async-handler');
const UserModel = require("../models/userModel");
const bcrypt = require('bcryptjs');    //for incrybt password

//create user =====================================================================
exports.createUsers=asyncHandler( async(req,res)=>{
    const name =req.body.name;
    const email =req.body.email;
    const password =req.body.password;
    const phone =req.body.phone;
    const carType =req.body.carType;
    const role =req.body.role;
    const newUser = await UserModel.create(req.body);

    res.status(StatusCodes.OK).json({
        user: newUser
    });
}); 


//get all users =====================================================================
exports.getUsers = asyncHandler(async (req, res) => {
    const users = await UserModel.find({});
    res.status(200).json({ results: users.length, data: users });
});

//get  specific user ==========================================================
//GET /api/v1/users/name
exports.getUser = asyncHandler(async (req, res) => {
    const name  = req.params.name;
    const user = await UserModel.findOne({name : name});    //===>> findOne for #name# BUT findById for #ID#
    if (!user) {
    res.status(404).json({ msg: `No user for this name ${name}` });
    }
    res.status(200).json({ data: user });
}); 

// update user ===================================================================
//PUT /api/v1/users/id
exports.updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const carType = req.body.carType;

    const user = await UserModel.findOneAndUpdate(
    { _id: id },
    { name:name , email :email   ,phone : phone , carType: carType  },        //mt3ml4 update for password
    { new: true }
    );
    if (!user) {
    res.status(404).json({ msg: `No user for this id ${id}` });
    }
    res.status(200).json({ data: user });
});

//change pasword ===========================================================
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const password = req.body.password;

    const user = await UserModel.findOneAndUpdate(
        { _id: id },
        {password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now()},                //for incrybt password
        { new: true } );

        if (!user) {
            res.status(404).json({ msg: `No user for this id ${id}` });
            }
            res.status(200).json({ data: user });
        });

//delete user ======================================================================
exports.deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
    res.status(404).json({ msg: `No user for this id ${id}` });
    }
    res.status(204).send();
});