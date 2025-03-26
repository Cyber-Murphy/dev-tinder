const mongoose=require('mongoose')

const connectionSchema= new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        enum:{
            
            values:["ignored","accepted","rejected","interested"],
            message:`{VALUE} is incorrect status type`
        }
    }

},{timestamps:true})


const ConnectionRequest= new mongoose.model("ConnectionRequest",connectionSchema)
module.exports=ConnectionRequest