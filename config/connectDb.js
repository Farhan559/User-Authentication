import mongoose from "mongoose";

    const connectDB = async(Database_URL)=>{
        try{
            const DB_OPTIONS = {
                dbName:"WebApp"   //Database Name
            }
            await mongoose.connect(Database_URL,DB_OPTIONS)
            console.log('Conneted Successfully..')
        }catch(error){
            console.log(error);
        }
    }

    export default connectDB;