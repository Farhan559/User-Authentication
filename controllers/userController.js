import userModel from "../models/user.js";
import bcrypt from 'bcrypt';  // using for password hashing.
import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';

class UserController{
    static userRegistration = async (req,res)=>{
    const {name, email, password, password_confirm, tc}= req.body 
    const user = await userModel.findOne({email:email})
    
    
    
    if(user){
        res.send({"status":"failed","message":"Email already exists"})
    }
    else{
        if(name && email && password && password_confirm && tc){
          if(password === password_confirm)
          {
            try{
            const salt = await bcrypt.genSalt(10);   //for bcrypt the password
            const hashPass = await bcrypt.hash(password,salt)
            const doc = new userModel({
                name:name,
                email:email,
                password:hashPass,          // password will save hashpassword for security purpose
                tc:tc
            })
            await doc.save();
            const savedUser = await userModel.findOne({email:email})
            // Generate JWT Token
            const token = jwt.sign({userID:savedUser._id},process.env.JWT_SECRET_KEY,{expiresIn:'5h'})
            res.status(201).send({"status":"Success","message":"Registeration Successfuly done","token":token})
            }catch(error){
                res.send({"status":"failed","message":"Unable to Resgister"})
            }
          } else{
              res.send({"status":"failed","message":"Password and Confirm Password doesn`t match"})

          } 
        }
        else{
        res.send({"status":"failed","message":"All fileds are required!"})

    }
    
    

    }
}
        // UserLogin
        static userLogin = async (req,res)=>{
            try {
                const {email,password} = req.body
                if(email && password){
                    const user = await userModel.findOne({email:email})
                    if(user != null){
                        const isMatch = await bcrypt.compare(password,user.password) //compare password
                        if((user.email === email)&& isMatch){
                        
                            // Generate JWT Token
                        
                            const token = jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5h'});

                        res.send({"status":"success","message":"Login Success","Token":token})
                        }else{
                        res.send({"status":"failed","message":"Email or password is not valid"})
                        }
                    
                    }else{
                        res.send({"status":"failed","message":"You are not registered user"})
                    }
                }else{
                    res.send({"status":"failed","message":"All fileds are required"})
                }
            } catch (error) {
                console.log(error)
                res.send({"status":"failed","message":"Unable to Login"})
            }
        }
            // CHANGE PASSWORD
            static chnageUserPassword = async(req,res)=>{
                const {password,password_confirm} = req.body
                if(password && password_confirm){
                    if(password !== password_confirm){
                    res.send({"status":"failed","message":"Password and confirm pass doesn`t matched"})
                    }
                else{
                    const salt = await bcrypt.genSalt(10)
                    const newhashPass = await bcrypt.hash(password,salt)
                    await userModel.findByIdAndUpdate(req.user._id, {$set:{password:newhashPass}})
                    res.send({"status":"Success","message":"Password Change Succesfully"})  
                }

                }else{
                    res.send({"status":"failed","message":"All fileds are required!"})
                }
            }
                 
        
       }
    export default UserController







