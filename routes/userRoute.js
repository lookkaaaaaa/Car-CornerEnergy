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
        changeUserPassword,
        getLoggedUserData,
        updateLoggedUserPassword,
        updateLoggedUserData,
        deleteLoggedUserData,
        activeLoggedUserData
        }  =require('../services/userServices');

    const authService = require('../services/authServices');
    //2) Logged User**

    router.use(authService.protect);
    router.get('/getMe', getLoggedUserData, getUser);
    router.put('/changeMyPassword', updateLoggedUserPassword);
    router.put('/updateMe', updateUserValidator, updateLoggedUserData);
    router.delete('/deleteMe', deleteLoggedUserData);
    router.post('/activeMe', activeLoggedUserData)
    //1) Admin***
router.use(authService.allowedTo('admin', 'manager'));

    router.route('/').post(createUserValidator ,createUsers  ).get(getUsers );
    router.route('/:id').get(getUserValidator ,getUser);
    router.route('/:id').put(updateUserValidator , updateUser  );
    router.route('/:id').delete(deleteUserValidator , deleteUser );
    router.put('/changePassword/:id',changeUserPasswordValidator , changeUserPassword); //password
    
module.exports=router;