import mongoose from 'mongoose';

export async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI)
        const connection = mongoose.connection;
        connection.on("connected", ()=>{
            console.log("connected to db successfully");
        })
        connection.on("error", (err)=>{
            console.log("error while connecting to db", err);
            process.exit();
        })

    } catch (error) {
        console.log("failed to connect to db", error);
    }
}