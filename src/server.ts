import mongoose from "mongoose";
import dotenv from "dotenv";
import app from './app'
dotenv.config()

const DB_URI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 3000;


mongoose.connect(DB_URI).then(() => {
    console.log("MongoDB Connected");
}).catch((err) => {
    console.log(err);
})

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})

process.on("unhandledRejection",(err)=>{
    console.log("unhandledRejection");
    server.close(()=>{
        process.exit()
    })
})