const express =require('express');
const dotenv=require('dotenv');
const morgan =require('morgan');
const mongoose = require('mongoose');
dotenv.config({path:'config.env'});
const dbConnection=require('./config/database');
const userRoute=require('./routes/userRoute');
const authRoute=require('./routes/authRoute');
const locationRoute=require('./routes/locationRoute');
const stationRoute2  =require('./routes/stationRoute2');
const couponRoute  =require('./routes/couponsRoute');


const errorHandler = require('./Middleware/error-handler');
const notFoundErr = require('./Middleware/notFoundMiddleware');
//..dbconnection
dbConnection();


//..express app

const app = express();

//..middleWare
app.use(express.json());
if(process.env.NODE_ENV =="development"){
app.use(morgan('dev'));
console.log(`mode:${process.env.NODE_ENV}`);
}


//.. mountRoutes
app.use('/api/v1/users',userRoute);
app.use('/api/v1/locations',locationRoute);
app.use('/api/v1/stations',stationRoute2 );
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/coupons',couponRoute );
// app.use((err,req,res,next)=>{
//     console.log(err);
// })
app.use(errorHandler);
app.use(notFoundErr);

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`App running on port ${PORT}`);

});

// //create index 
// db.stations.createIndex({"attributeName" : "2dSphare"});

// //Query 