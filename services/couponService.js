const { StatusCodes } = require("http-status-codes");
const asyncHandler = require('express-async-handler');
const couponModel=require("../models/couponModel");


//create  ===================================================================== (Admin)
exports.createcoupon=asyncHandler( async(req,res)=>{
    const name =req.body.name;
    const expire =req.body.expire;
    const discount =req.body.discount;
    

    const newCoupon= await couponModel.create(req.body);
    res.status(StatusCodes.OK).json({
        coupon : newCoupon
    });
}); 

//get  =====================================================================
exports.getCoupons = asyncHandler(async (req, res) => {
    const coupons = await couponModel.find({});
    res.status(200).json({ results: coupons.length, data: coupons });
});

//get  specific coupon ==========================================================
//GET /api/v1/coupons/:name
exports.getCoupon = asyncHandler(async (req, res) => {

    const name  = req.params.name;
    const coupon = await couponModel.findOne({name : name });    //===>> findOne for #name# BUT findById for #ID#
    if (!coupon) {
    res.status(404).json({ msg: `No coupon for this name ${name}` });
    }
    res.status(200).json({ data: coupon });
}); 

// update  ===================================================================
//PUT /api/v1/coupons/id
exports.updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const name = req.body.name;
    const expire = req.body.expire;
    const discount = req.body.discount;

    const coupon = await couponModel.findByIdAndUpdate(
    { _id: id },
    { name:name , expire :expire   ,discount : discount  },        
    { new: true }
    );
    if (!coupon) {
    res.status(404).json({ msg: `No coupon for this id ${id}` });
    }
    res.status(200).json({ data: coupon });
});
//delete  ======================================================================
//DELETE /api/v1/coupons/:id
exports.deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const coupon = await couponModel.findByIdAndDelete(id);
    if (!coupon) {
    res.status(404).json({ msg: `No coupon for this id ${id}` });
    }
    res.status(204).send();
});
