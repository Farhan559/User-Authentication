import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

    var checkUserAuth = async(req,res,next)=>{
        let token ;
    const {authorization} = req.headers
    if(authorization && authorization.startsWith('Bearer')){
        try {
                // Get Token From Header
            token = authorization.split(' ')[1]
            // VERIFY TOKEN
        const {userID} = jwt.verify(token , process.env.JWT_SECRET_KEY)
            
            // Get token from User
            req.user = await userModel.findById(userID).select('-password')
            //  console.log(req.user)
            next(); 
        } catch (error) {
            res.status(401).send({"status":"Failed","message":"Unauthorized User"})
        }
    }
    if(!token){
            res.status(401).send({"status":"Failed","message":"Unauthorized User No Token !!"})

        }
        app.get('/protected-route', checkUserAuth, (req, res) => {
            // Access user information via req.user
            const user = req.user;
            res.send(`Authenticated user: ${user.name}`);
          });
        
}
        
    export default checkUserAuth;