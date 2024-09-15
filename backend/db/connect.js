import mongoose from "mongoose";


const connectDB = async () => {
    try {   
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("Connected to mongodb")

    }
    catch(err){
        console.log("Error connecting to mongodb ",err.message)
    }
}

export default connectDB