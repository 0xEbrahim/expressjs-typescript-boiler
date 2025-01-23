import {Request, Response, NextFunction, CookieOptions} from "express"
import jwt, {JwtPayload} from "jsonwebtoken";
import {User} from "../models/userModel";
import AppError from "../utils/AppError";
import {asyncHandler} from "../utils/asyncHandler";
import {IDecoded, IUser} from "../interfaces/user";




const generateToken = (id: string) => {
    return jwt.sign({id}, process.env.JWT_SECRET as string, {expiresIn: process.env.JWT_EXPIRES});
}

const cookieOptions : CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 3600 * 60 * 60 * 1000),
    sameSite: 'strict',
}

const sendResponse = async (res: Response, user: any , code: number): Promise<void> => {
    // console.log(process.env.REFRESH_TOKEN_EXPIRES);
    const token = generateToken(user._id);
    const refreshToken = jwt.sign({id: user._id}, process.env.REFRESH_TOKEN_SECRET as string, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES
    } );
    const updated = await User.findByIdAndUpdate(user._id, {refreshToken: refreshToken}, {new: true})
    res.cookie("jwt", refreshToken, cookieOptions)
    user.password = undefined;
    res.status(code).json({status:"Success", data:{
        user
    },token})
}

export const login = asyncHandler(async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    const {email, password} = req.body;
    const user = await User.findOne({email}).select("+password");
    if(!user || !(user.comparePassword(password))) return next(new AppError("Wrong email or password.", 401))
    await sendResponse(res,user,200)
})

export const signup = asyncHandler(async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    const user = await User.create({...req.body});
    await sendResponse(res,user,201)
})

export const refresh = asyncHandler(async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    const refreshToken = req.cookies.jwt;
    if(!refreshToken) return next(new AppError("No refresh token, please login again", 401));
    const decoded : IDecoded = await (jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string)) as JwtPayload extends {dec : IDecoded} ? JwtPayload : never;
    if(!decoded) return next(new AppError("Invalid refresh token", 403));
    const user : IUser | null = await User.findById(decoded.id);
    if(!user) return next(new AppError("Invalid refresh token", 403));
    const token = generateToken(user._id as string);
    res.status(200).json({
        status:"Success",
        data:{user},
        token:token
    })
})

export const logout = asyncHandler(async (req:Request, res:Response, next:NextFunction):Promise<any> => {
    const refreshToken : string = req.cookies.jwt;
        if(!refreshToken ) return next(new AppError("You are already logged out", 401));
    const user : IUser | null = await User.findOne({refreshToken: refreshToken });
    if(!user) {
        res.clearCookie("jwt")
       return res.status(204).json({status:"Success"});
    }
    user.refreshToken = "";
    await user.save();
    res.clearCookie("jwt")
    res.status(204).json({status:"Success"});
})

export const protect = asyncHandler(async(req : Request,
                                           res: Response , next: NextFunction): Promise<void> => {
let token = "";
if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    token = req.headers.authorization.split(" ")[1];
}
if(!token)
    return next(new AppError("Please login first", 403));
const decoded : IDecoded = await (jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string)) as JwtPayload extends {dec : IDecoded} ? JwtPayload : never;
const user = await User.findById(decoded.id);
if(!user)
    return next(new AppError("This user may not belongs to this token anymore", 403));
req.user = user;
next();
})