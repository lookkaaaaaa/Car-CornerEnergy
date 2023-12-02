const express = require('express');
const router = express.Router();

const {
    getUsers,
    getUser,
    createUsers,
    updateUser,
    deleteUser,
    }  =require('../services/userServices');
    
    router.route('/').post(createUsers).get(getUsers);

    router.route('/:name').get(getUser,)
    
    router.route('/:id').put(updateUser).delete(deleteUser);
    
module.exports=router;