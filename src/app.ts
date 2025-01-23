import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'
import cors from "cors";
import {globalErrorHandler} from "./controllers/errorController";
import AppError from "./utils/AppError";
import {userRouter} from "./routes/user.routes";
import {authRouter} from './routes/auth.routes'

const app = express();

app.use(helmet())
app.use(morgan(process.env.NODE_ENV==="production" ? "combined" : "dev"));
app.use(express.json({limit:"10kb"}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(cors({ credentials: true, origin: true }));

app.use("/user",userRouter)
app.use("/auth",authRouter)

app.all('*',(req, res, next) => {
    next(new AppError("Not fount", 404))
    res.status(404).json({message:'Not Found'});
})

app.use(globalErrorHandler)
export default app