const express=require('express')
const profileRouter=express.Router()
const {userAuth}=require('../middlewares/auth')
const bcrypt=require('bcrypt')
const {validateEditProfileData, validateEditPassword}=require('../utils/validation')


profileRouter.get('/profile/view',userAuth,async (req,res)=>{
       try {
        const user=req.user
       res.send(user);
       } catch (error) {
        return res.status(340).send('please gaurav enter correct details')
       }
       
        // console.log(cookiei);
        // res.send('reading cookies')
        
})
// User can edit their profile
profileRouter.patch('/profile/edit', userAuth,async (req,res)=>{
        try {
                // The below validation function is made inside the utils folder
                if(!validateEditProfileData(req)){
                        throw new Error("Invalid edit request Gaurav");
                        
                }
                // So this req.user brings the user which is logged in , this is coming from userauth . after authentication the user's object is stored in req.user
                const LoggedInUser=req.user 
                /* 
                1.Now we'll bring the details the user has entered to edit via async(req,res)
                2.Remember this req is diff from LoggedInUser=req.user because this req.user
                 is the details of the user which wanted to be edited .
                3.console.log(LoggedInUser); this is details of user which is not been edited till now.
                */

                // This code updates `LoggedInUser` with the values from `req.body`, ensuring all matching keys get new data from the request.
               Object.keys(req.body).forEach(keys=>LoggedInUser[keys]=req.body[keys])
                // console.log(LoggedInUser);
                //1 . you can send this also
                // res.send(`${LoggedInUser.firstName} 's profile is updated successfully`)

                //2. industry standard of sending response
                await LoggedInUser.save()
               return res.json({message:`${LoggedInUser.firstName} 's profile is updated successfully`,data:LoggedInUser})


                
                

        } catch (error) {
              return  res.status(343).send("the error is "+ error.message)
        }

})
profileRouter.patch('/profile/edit/password', userAuth,async(req,res)=>{
                try {
                        //this is wrong becuase validateEditPassword is async function it will not return boolean , it will return a promise
                //        if(!validateEditPassword(req)){
                //         throw new Error("incorrect password is not matched")
                //        } 
                if(! await validateEditPassword(req)){
                        throw new Error("password is not correct");
                        
                }
                       const newPassword=req.body.password
                        //2. if correct then allow them to make new password 
                       let  NewHashedPassword= await bcrypt.hash(newPassword,10)
                       req.user.password=NewHashedPassword
                        
                       await req.user.save()
                       res.send("Your password is updated successfully")


                } catch (error) {
                       return res.status(323).send('You have error  :' +error.message)
                }
            //3. hash the new password and then replace them in db
                
})



module.exports=profileRouter