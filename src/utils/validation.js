const validator= require('validator')

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

module.exports={validateSignUpData}