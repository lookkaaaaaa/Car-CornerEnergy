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
    const id  = req.params.id;
    const user = await UserModel.findOne({_id : id});    //===>> findOne for ->#name or ID# BUT findById for ->#ID only#
    if (!user) {
    res.status(404).json({ msg: `No user for this id ${id}` });
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


//********************************************************************************************
// @desc    Get Logged user data
// @route   GET /api/v1/users/getMe
// @access  Private/Protect
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});
// @desc    Update logged user password
// @route   PUT /api/v1/users/updateMyPassword
// @access  Private/Protect
const createToken = require('../utils/createToken');
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    // 1) Update user password based user payload (req.user._id)
    const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
        password: await bcrypt.hash(req.body.password, 12),
        passwordChangedAt: Date.now(),
    },
    {new: true,});
    // 2) Generate token
    const token = createToken(user._id);
    res.status(200).json({ data: user, token });
});
// @desc    Update logged user data (without password, role)
// @route   PUT /api/v1/users/updateMe
// @access  Private/Protect
exports.updateLoggedUserData = asyncHandler(async (req, res, next) => {
    const updatedUser = await UserModel.findByIdAndUpdate(
    req.user._id,
    {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
    },
    { new: true });
    res.status(200).json({ data: updatedUser });
});
// @desc    Deactivate logged user
// @route   DELETE /api/v1/users/deleteMe
// @access  Private/Protect
exports.deleteLoggedUserData = asyncHandler(async (req, res, next) => {
    await UserModel.findByIdAndUpdate(req.user._id, 
        { active: false });
    res.status(204).json({ status: 'Success' });
});
// @desc    activate logged user
// @route   DELETE /api/v1/users/activeMe
// @access  Private/Protect
exports.activeLoggedUserData = asyncHandler(async (req, res, next) => {
    await UserModel.findByIdAndUpdate(req.user._id, 
        { active: true });
    res.status(204).json({ status: 'Success' });
});