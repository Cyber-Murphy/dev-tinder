const express=require('express')
const requestRouter= express.Router()
const {userAuth}=require('../middlewares/auth')
const ConnectionRequest= require('../models/connectionrequest')
const User=require('../models/user')

requestRouter.post('/request/send/:status/:toUserId',userAuth, async (req,res)=>{
      try {

        const fromUserId=req.user._id // ye user ka id hai jo request bhej rha hai , ye user jab login karega userauth se tab aayea
        const toUserId=req.params.toUserId // It fetches the touserid from the url i.e /request/send/:status/:toUserId
        const status= req.params.status

        //26/3/25  1.making validation so that only allowed status
        const isAllowed=['interested','ignored']
        if (!isAllowed.includes(status)) {
          throw new Error("Status is not allowed");
        }
        //2. now only one request should be sent if a -->b then b--/-->a
        const existingConnectionRequest=await ConnectionRequest.findOne({
          // or condition in mongodb
          $or:[
            {fromUserId:fromUserId,toUserId:toUserId},
            {fromUserId:toUserId,toUserId:fromUserId}
          ]
        })
        if(existingConnectionRequest){
          // console.log(existingConnectionRequest);
          return res.status(323).send({message: "The connection already exists"})
        }
        //3. We don't want to send to random things . we only want to send the request to the people who are already present in the User DB

        const toUser= await User.findById(toUserId)
        if(!toUser){
          return res.status(332).send({message:"The user not found Gaurav"})
        }
        //4 user shouldn't sent request to themselves . Go to models/connectionreq for this

        const connectionRequest= new ConnectionRequest({
          fromUserId,
          toUserId,
          status
        })
        
        const data= await connectionRequest.save()
        res.json({message:"the request is sent successfully",
          data
        })
      } catch (error) {
        res.status(400).send('error'+error.message)
      } 

 })

 // 27/3/25 , Now we'll make to review the request , means user can accept/reject the request incoming to him from another user
 // If harsh sent the intrested request to elon musk , then elon will 1st login and then will choose weather to accept the request or reject it .

 requestRouter.post('/request/review/:status/:requestId',userAuth, async (req,res)=>{

          try {
            LoggedInUser=req.user
         const {status,requestId}= req.params
          // 1. check only two status are allowed in url i.e accepted,rejected
          const allowedStatus=["accepted","rejected"]
          if (!allowedStatus.includes(status)) {
            throw new Error("Please enter the correct Status");
          }
          //2. check if a)requested_id is correct,b) touserid is correct ,c) status is only interested . it shouldn't be ignored status

          const connectionrequest=await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:LoggedInUser._id,
            status:'interested'
          })
          //3. Updated the status to either accepted or rejected coming from the url
          connectionrequest.status=status
          const data= await connectionrequest.save()
          res.send(data)

            
          
          } catch (error) {
            res.status(322).json({message: error.message})
          }


 })


 module.exports=requestRouter
 