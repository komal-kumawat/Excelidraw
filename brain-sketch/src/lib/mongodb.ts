import mongoose from "mongoose";

const mongodb_url = process.env.MONGO_URI as string ;

if(!mongodb_url){
    throw new Error("mongodb url not found please define it in .env file");

}

interface GlobalMongoose {
    conn:typeof mongoose|null;
    promise:Promise<typeof mongoose>|null;
}

declare global{
    var mongoose:GlobalMongoose
}
let cached = global.mongoose;
if(!cached){
    cached = global.mongoose = {conn:null , promise:null};
}

async function connectDB(){
    if(cached.conn){
        return cached.conn;
    }
    if(!cached.promise){
        const options = {
            bufferCommands:false,
            maxPoolSize:10,
            serviceSelectionTimeoutMS:5000,
            socketTimeoutMS:45000,
            family:4
        };

        cached.promise = mongoose.connect(mongodb_url , options)
        .then((mongoose)=>{
            console.log("mongodb connected successfully");
            return mongoose
        })
    }
    try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error("MongoDB connection error:", e);
    throw e;
  }

  return cached.conn;
}

export default connectDB;
