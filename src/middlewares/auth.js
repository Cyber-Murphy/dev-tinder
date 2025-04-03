const jwt=require('jsonwebtoken')
const User= require('../models/user')

// Creating a auth middleware to put inside the various pages like /profile,/feed,etc

const userAuth=async  (req,res,next)=>{
    try {
        // 1.Read the cookie from the server
    const cookies=req.cookies
    
    // 2.Validate/verify that cookie
    const {token}= cookies
    if(!token){
        throw new Error("Token is not found");
        
    }
    const decodedObj= await jwt.verify(token,"Gaurav@123")
    
    // 3. Find the user 
    const {_id}=decodedObj
    const user= await User.findById(_id)
    if(!user){
        throw new Error("Invalid user ")
    }
    req.user=user // this send all the user in the req.user.This stores the details of logged in user so that we can use in some other routes when this middleware is used.
    next()
    } catch (error) {
         return res.status(494).send("gaurav enter the correct details")
    }
}

module.exports={userAuth}