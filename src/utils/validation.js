const validator= require('validator')
const bcrypt=require('bcrypt')
const {userAuth}=require('../middlewares/auth')


const validateSignUpData=(req)=> {
            const {firstName,lastName,password,emailId}= req.body
            if(!firstName||!lastName){
                throw new Error("Please enter full name");
            }
           else if(!validator.isEmail(emailId)){
                throw new Error("Please enter the correct emailId");
                
           }
           else if(!validator.isStrongPassword(password)){
            throw new Error("Please enter the strong password gaurav")
           }
}

const validateEditProfileData=  (req)=>{
        const AllowededitFields=["firstName","lastName","photo","about","skills"]
        const isEditAllowed=Object.keys(req.body).every(k=>AllowededitFields.includes(k))

        return isEditAllowed // return boolean 
} 

const validateEditPassword=  async (req)=>{
// just make an currentpassword a tempory to store the current password 
    const {Currentpassword}= req.body
    //1. check if the current password is correct
    const isPasswordcorrect= await bcrypt.compare(Currentpassword,req.user.password)
    return isPasswordcorrect
    
}

module.exports={validateSignUpData,validateEditProfileData,validateEditPassword}