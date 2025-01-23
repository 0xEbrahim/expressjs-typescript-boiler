import {Request, Response, NextFunction} from "express";
import {Document, Model} from "mongoose";
import APIFeatures from "../utils/APIFeatures";
import AppError from "../utils/AppError";
import {asyncHandler} from "../utils/asyncHandler";

export const createEntity = <T extends Document>(Model : Model<T>) => asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);
    res.status(201).json({doc});
})

export const getAllEntity = <T extends Document>(Model : Model<T>) => asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
    const features = new APIFeatures(Model.find(),req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    const docs = await features.query;
    res.status(200).json({docs});
})

export const updateEntity = <T extends Document>(Model : Model<T>) => asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndUpdate(id, req.body,{new: true});
    if(!doc)
        next(new AppError("No document with ID " + id, 404));
    res.status(200).json({doc});
})

export const deleteEntity = <T extends Document>(Model: Model<T>) => asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);
    if(!doc)
        next(new AppError("No document with ID " + id, 404));
    res.status(204).json({})
})

export const getEntity = <T extends Document>(Model: Model<T>) => asyncHandler(async (req: Request, res: Response, next:NextFunction) => {
    const id = req.params.id;
    const doc = await Model.findById(id);
    if(!doc)
        next(new AppError("No document with ID " + id, 404));
    res.status(200).json({doc});
})