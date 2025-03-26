const express=require('express')
const requestRouter= express.Router()
const {userAuth}=require('../middlewares/auth')
const ConnectionRequest= require('../models/connectionrequest')


requestRouter.post('/request/send/:status/:toUserId',userAuth, async (req,res)=>{
      try {

        const fromUserId=req.user._id // ye user ka id hai jo request bhej rha hai , ye user jab login karega userauth se tab aayea
        const toUserId=req.params.toUserId // It fetches the touserid from the url i.e /request/send/:status/:toUserId
        const status= req.params.status

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

 module.exports=requestRouter
 