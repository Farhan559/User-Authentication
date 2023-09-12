// import mongoose from "mongoose";

//     //Defining Schema.
// const userSchema = new mongoose.Schema({
//     name:{type:String,required:true,trim:true}, // trim used for remove spaces.
//     email:{type:String,required:true,trim:true}, 
//     password:{type:String,required:true,trim:true}, 
//     tc:{type:Boolean,required:true}     //checking condition. 

// })
// // Model 
// const userModel = mongoose.model('user','userSchema');  // creating table as user

// export default userModel;

import mongoose from "mongoose";

// Defining Schema.
const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    password: { type: String, required: true, trim: true },
    tc: { type: Boolean, required: true }
});

// Model 
const userModel = mongoose.model('user', userSchema);  // Pass the actual Schema object

export default userModel;
