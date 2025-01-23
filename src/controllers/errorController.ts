import {NextFunction, Request, Response} from "express";
import AppError from "../utils/AppError";


// Invalid IDs or paths
const handleCastErrorDB = (err : any) : AppError => {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 500);
}

const handleDuplicateDB = (err:any): AppError=>{
    const value = Object.values(err.keyValue).join(', ');
    const message = `Duplicate field value: ${value}. Please use another value!`
    return new AppError(message, 400);
}

const handleValidationErrorDB = (err:any): AppError=>{
    const errors = Object.values(err.errors).map((el:any)=>el.message);
    const message = `Invalid input data. ${errors.join('. ')}`
    return new AppError(message, 400);
}
const sendErrorDev = (err : any, res : Response) => {
    res.status(err.statusCode).json({
        error:err,
        message:err.message,
        status: err.status,
        stack:err.stack
    })
}
const sendErrorProd = (err : AppError, res : Response)=> {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message,
        })
    }else{
        console.error(err)
        res.status(500).json({
            status:"error",
            message:"Something went wrong."
        })
    }

}
export const globalErrorHandler = (err: any, req:Request, res:Response, next:NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if(process.env.NODE_ENV === "development") {
        sendErrorDev(err, res)
    }else if(process.env.NODE_ENV === "production") {
        let error = {...err}
        if(err.name === "CastError") error = handleCastErrorDB(error);
        if(err.code === 11000) error = handleDuplicateDB(error);
        if(err.name === "ValidationError") error = handleValidationErrorDB(error);
        sendErrorProd(error as AppError, res)
    }
}