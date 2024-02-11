
// const {StatusCodes} = require('http-status-codes')
// const errorHandlerMiddleware = (err, req, res,next) => {
//     const customError = {
//         msg: err.message  || 'Something went wrong try again later',
//         statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
//     }
//     if (err.name === 'ValidationError') {
//         customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
//         customError.statusCode = StatusCodes.BAD_REQUEST;
//     }
//     if (err.code && err.code === 11000) {
//         customError.msg = `Duplicate value entered for ${Object.keys(
//             err.keyValue
//         )} field, please choose another value`
//         customError.statusCode = StatusCodes.BAD_REQUEST 
//     };
//     if (err.name === 'CastError') {
//         customError.msg = `No Item found with id ${err.value}`;
//         customError.statusCode = StatusCodes.NOT_FOUND;
//     }
//     if (err.name === 'JsonWebTokenError') {
//         customError.msg = `Invalid token, please login again...`;
//         customError.statusCode = StatusCodes.UNAUTHORIZED;
//     }
//     if (err.name === 'TokenExpiredError') {
//         customError.msg = `Expired token, please login again...`;
//         customError.statusCode = StatusCodes.UNAUTHORIZED;
//     }
//     res.status(customError.statusCode).json({ msg: customError.msg });
// };

// module.exports = errorHandlerMiddleware;




//******************************************************************
const ApiError = require('../Middleware/ApiError');

const sendErrorForDev = (err, res) =>
    res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
    });

const sendErrorForProd = (err, res) =>
    res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    });

const handleJwtInvalidSignature = () =>
    new ApiError('Invalid token, please login again..', 401);

const handleJwtExpired = () =>
    new ApiError('Expired token, please login again..', 401);

const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
        if (process.env.NODE_ENV === 'development') {
    sendErrorForDev(err, res);
    } else {
    if (err.name === 'JsonWebTokenError') err = handleJwtInvalidSignature();
    if (err.name === 'TokenExpiredError') err = handleJwtExpired();
    sendErrorForProd(err, res);
}};

module.exports = globalError;