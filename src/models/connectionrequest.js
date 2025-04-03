const mongoose=require('mongoose')

const connectionSchema= new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User" // 27/3/25 Use to link one collection to another by storing the object id
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User" //27/3/25 Use to link one collection to another by storing the object id
    },
    status:{
        type:String,
        enum:{
            
            values:["ignored","accepted","rejected","interested"],
            message:`{VALUE} is incorrect status type`
        }
    }

},{timestamps:true})

//making a index so that it leads to faster queries , if u want to search some people , it will fast check

connectionSchema.index({fromUserId:1 , toUserId:1})

// .26/3/25  we are using pre hook/middleware, so that person can't send req to itself
// It will run before save()
connectionSchema.pre('save', function (next) {
    const connectionRequest=this
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("You cant send the request to yourself");
        
    }
    next()
})

const ConnectionRequest= new mongoose.model("ConnectionRequest",connectionSchema)
module.exports=ConnectionRequest