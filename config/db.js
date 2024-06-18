import mongoose from "mongoose";
const connectdb = async()=>{
    try{
        const connection = await mongoose.connect(process.env.MONGO_URL)
        console.log(`Connected to MongoDB Database ${mongoose.connection.host}`)
    }catch(err){
            console.log(`Error in Connection ${err}`)
    }
}

export default connectdb;