const express=require('express')
const userRouter= express.Router()
const {userAuth}=require('../middlewares/auth')
const ConnectionRequest=require('../models/connectionrequest')
const { set } = require('mongoose')
const user = require('../models/user')


userRouter.get('/user/request/received', userAuth, async(req,res)=>{
    
    try {
        // 1. we only need , user who have sent the interested status to the loggedIN user
        const LoggedinUser=req.user
        const connectionrequest= await ConnectionRequest.find({
            toUserId:LoggedinUser._id,
            status:"interested"

        }).populate("fromUserId", ['firstName','lastName','photo','age','gender','about'])
            const data = connectionrequest
            res.json({message:"the following received requests are", data})
            
        } catch (error) {
            res.status(320).json({message: error.message})
        }
})

// 28/3/25 now we are making , so that loggedinuser can see , who he had made connection with.

userRouter.get('/user/connections', userAuth,async(req,res)=>{
   try {
    loggedInUser=req.user
    // find all : case1. loggedinuser received the request and he accepted it.
    //            case2. loggedinuser sent the request and other user accepted it

    const connectionrequest= await ConnectionRequest.find({
        $or:[
            {fromUserId:loggedInUser._id ,status:"accepted"},
            {toUserId:loggedInUser._id,status:"accepted"}
        ]
    }).populate("fromUserId",["firstName","lastName","photo","age","gender","about"]).populate("toUserId",["firstName","lastName","photo","age","gender","about"]) 
    console.log(connectionrequest);
    
    const data=connectionrequest.map((row)=>{
        if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
            return row.toUserId
        }
        return row.fromUserId
    })
    res.json({data})

   } catch (error) {
    res.status(323).send(error.message)
   }


})


//28/3/25 we are making a feed so that the loggedin user can see his feed

userRouter.get('/feed', userAuth, async(req,res)=>{
    try {
        // we'll use skip() and limit() for pagination
        // takes page from /feed?page=2 . '2' is a string so convert itinto integer  & ||1 is default , means if user just write /feed , it will show the first page
        // to use as eg write in postman /feed/page=2&limit=10 , so it will go to page 2nd and shows next 10 users means it skip the first 10 users
        const page= parseInt(req.query.page)||1  
        let limit= parseInt(req.query.limit)||10
        limit= limit>50 ?50:limit
        // calculate the skip 
        const skip=(page-1)*limit


        /*
        loggedInuser should be able to see feed except the:-
        1. His own card
        2. His connections(i.e accepted request)
        3. Ignored users
        4. already sent the request (i.e interested connection)
        */
        const loggedInUser= req.user
        const connectionrequest= await ConnectionRequest.find({
            // find all the users , he is interacted with anything i.e usne request bheja kisko ya usko mila ye request
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select('fromUserId toUserId')

        
        // Now we want to store all the unqiues ids . eg: fromuserid:elonmusk ki id bhi ho skti hai , and touserid:elonmusk ki id bhi ho skti hai ,toh will get two same ids . so we want only the unique ones . 
        // so we'll use set()
        // these users i don't want in my feed, set() makes only unqiue entries allowed
        const hideUserfeed= new Set()
        connectionrequest.forEach(req=>{
            hideUserfeed.add(req.fromUserId.toString())
            hideUserfeed.add(req.toUserId.toString())
        })

        // console.log(hideUserfeed); gives only unqiues ids

        //so hideuserfeed . this he have to hide from the user's feed

        const users= await user.find({
           // $nin:  (Not IN) is a MongoDB query operator that matches documents where a field's value is NOT in a given array
           /// $ne stands for "Not Equal". It excludes documents where a field matches a specific value.
                //Array.from(hideUserfeed) this converts sets into an array , since $nin accepts array not Set()
            $and:[
                {_id:{$nin: Array.from(hideUserfeed) }},
                // 2. user should also hide his id also from seeing 
                { _id:{$ne:loggedInUser._id}}
            ]
            
        }).select("firstName lastName photo about skills")
        .skip(skip).limit(limit) // chaining the skip and limit
        res.send(users)




        


    } catch (error) {
        res.json({message :error.message})
    }
})





module.exports=userRouter