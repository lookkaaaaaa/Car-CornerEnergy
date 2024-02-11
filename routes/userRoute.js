const express = require('express');
const router = express.Router();

const {
        getUserValidator,
        createUserValidator,
        updateUserValidator,
        deleteUserValidator,
        changeUserPasswordValidator,
    } = require('../validators/userValidator');

    const {
        getUsers,
        getUser,
        createUsers,
        updateUser,
        deleteUser,
        changeUserPassword
        }  =require('../services/userServices');

    router.route('/').post(createUserValidator ,createUsers  ).get(getUsers );
    router.route('/:name').get(getUserValidator ,getUser);
    router.route('/:id').put(updateUserValidator , updateUser  );
    router.route('/:id').delete(deleteUserValidator , deleteUser );

    router.put('/changePassword/:id',changeUserPasswordValidator , changeUserPassword);
    
module.exports=router;