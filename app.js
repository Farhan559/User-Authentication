import dotenv from 'dotenv';  // import dotenv
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from './config/connectDb.js';
import userRoutes from './routes/userRoutes.js';


const app = express();         // create express obj
const port = process.env.PORT;
const Database_URL = process.env.Database_URL;

    //CORS POlicy for connecting Frontend to backend
    app.use(cors());
    //Database Connection
    connectDB(Database_URL);
    //JSON 
    app.use(express.json());  //when we make an API we will use it.
    //Load Routes
    app.use("/api/user",userRoutes);

    app.listen(port,()=>{
        console.log('Server is runnig at port no :' +port);
    })