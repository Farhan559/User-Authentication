import express from 'express';
const router = express.Router();
import UserController from '../controllers/userController.js';
import checkUserAuth from '../middlewares/authMiddleWare.js';

    // Route Level MiddleWare - To Protect Route
    router.use('/changePassword',checkUserAuth)
   

    // Public Routes  (as like login register) 
    router.post('/register',UserController.userRegistration)
    router.post('/login',UserController.userLogin) 



    //Protected Routes  (which routes that is accessable after login).
    router.post('/changePassword',UserController.changeUserPassword)
    

    // Define a route for sending emails
    // router.post('/send-email', UserController.sendEmail);


    export default router