const express=require('express');
const{getUsers}=require('../services/userServices');
const router = express.Router();

router.post('/',getUsers);

module.exports=router;