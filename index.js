const express =require('express');
const dotenv=require('dotenv');
const morgan =require('morgan');
const mongoose = require('mongoose');
dotenv.config({path:'config.env'});
const dbConnection=require('./config/database');
const userRoute=require('./routes/userRoute');
const locationRoute=require('./routes/locationRoute');
const stationsRoute=require('./routes/stationsRoute');


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
app.use('/api/v1/stations',stationsRoute);
// app.use((err,req,res,next)=>{
//     console.log(err);
// })
app.use(errorHandler);
app.use(notFoundErr);

const PORT=process.env.PORT;
app.listen(PORT,()=>{
    console.log(`App running on port ${PORT}`);

});