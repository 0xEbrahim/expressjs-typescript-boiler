import {Request, Response, NextFunction} from "express";

export const asyncHandler = (fn:(req: Request, res: Response, next:NextFunction) => Promise<void>) =>
    async(req: Request, res: Response, next:NextFunction) => {
        await fn(req, res, next).catch(next);
    }