import userModel from "../models/user.js";
import bcrypt from 'bcrypt';  // using for password hashing.
import jwt from 'jsonwebtoken';
import logger from "../LogFiles/logger.js";


    
class UserController{
    static userRegistration = async (req,res)=>{
    console.time("userRegistration");   //Start Profiling

    const {name, email, password, password_confirm, tc}= req.body 
    const user = await userModel.findOne({email:email})
    
    
    
    if(user){
        logger.info('Email already exists:'+ email);
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
            
            
            logger.info('Registration successful for user:', email);
            console.timeEnd("userRegistration"); //End Profiling
            
            res.status(201).send({"status":"Success","message":"Registeration Successfuly done","token":token})
            }catch(error){
                logger.error('unable to Register:', error);
                res.send({"status":"failed","message":"Unable to Resgister"})
            }
          } else{
                logger.info('Password and confirm password doesn`t match for user');
              res.send({"status":"failed","message":"Password and Confirm Password doesn`t match"})

          } 
        }
        else{
        logger.info('All fields are required for registration')
        res.send({"status":"failed","message":"All fileds are required!"})

    }
    
    

    }
}
        // UserLogin
        static userLogin = async (req,res)=>{
            console.time('userLogin');
            try {
                const {email,password} = req.body
                if(email && password){
                    const user = await userModel.findOne({email:email})
                    if(user != null){
                        const isMatch = await bcrypt.compare(password,user.password) //compare password
                        if((user.email === email)&& isMatch){
                        
                            // Generate JWT Token
                        
                            const token = jwt.sign({userID:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5h'});
                            logger.info('Login Success', user);
                            res.send({"status":"success","message":"Login Success","Token":token})
                            console.timeEnd('userLogin');
                        }else{
                            logger.info('email or password is not valid');
                        res.send({"status":"failed","message":"Email or password is not valid"})
                        }
                    
                    }else{
                        logger.info('you are not registered user')
                        res.send({"status":"failed","message":"You are not registered user"})
                    }
                }else{
                    res.send({"status":"failed","message":"All fileds are required"})
                }
            } catch (error) {
                console.log(error)
                logger.error('Unable to Login');
                res.send({"status":"failed","message":"Unable to Login"})
            }
        }
            // CHANGE PASSWORD
            static changeUserPassword = async(req,res)=>{
                console.time('ChangePassword');
                const {password,password_confirm} = req.body
                if(password && password_confirm){
                    if(password !== password_confirm){
                    logger.info('Change password and confirm password doesnot matched.')
                    res.send({"status":"failed","message":"Password and confirm pass doesn`t matched"})
                    }
                else{
                    const salt = await bcrypt.genSalt(10)
                    const newhashPass = await bcrypt.hash(password,salt)
                    await userModel.findByIdAndUpdate(req.user._id, {$set:{password:newhashPass}})
                    logger.info('Password Change Successfully.')
                    res.send({"status":"Success","message":"Password Change Succesfully"})  
                    console.timeEnd('ChangePassword');
                }

                }else{
                    logger.info('All fields are required')
                    res.send({"status":"failed","message":"All fields are required!"})
                }
            }
                 
        
       }
       
    export default UserController







