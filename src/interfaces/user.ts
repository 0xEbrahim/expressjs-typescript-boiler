import {Document} from "mongoose";

export interface IUser extends Document{
    name: string,
    email: string,
    password: string,
    passwordChangedAt: Date,
    role: 'user' | 'admin',
    active: boolean,
    createdAt: Date,
    updatedAt: Date,
    passwordConfirm: string,
    isAdmin: boolean,
    refreshToken: string,
    age:Number,
    comparePassword(password: string):Promise<boolean>
}

export interface IDecoded{
    id:string,
    iat:number,
}
