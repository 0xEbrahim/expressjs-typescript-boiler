import bcrypt from "bcrypt"
import {model, Schema} from "mongoose";
import {IUser} from "../interfaces/user";


const userSchema = new Schema<IUser>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    passwordChangedAt:{
        type:Date
    },
    role:{
        type:String, enum:['user','admin'], default:'user'
    },
    isAdmin: {
        type: Boolean, default: false
    },
    refreshToken: {
        type: String
    },
    active:{
        type:Boolean,
        default: true
    },
    age:{
        type:Number,
    }
}, {
    timestamps:true
});

userSchema.pre("save", async function (next): Promise<void> {
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
})

userSchema.methods.comparePassword = async function(password: string):Promise<Boolean> {
    return await bcrypt.compare(password, this.password);
}


export const User = model<IUser>("User", userSchema)

