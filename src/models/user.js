const mongoose=require('mongoose')
const validator=require('validator')
const userSchema= mongoose.Schema({
    firstName:{
        type:String,
        required:true,// compulsory have to enter
        unique:true,
        minlength:3,
        maxlength:20
        
    },
    lastName:{
        type:String,
        required:true,
        minlength:3,
        maxlength:20
    },
    emailId:{
        type:String,
        // required:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Please enter correct email gaurav" );
                
            }
        }
        
    },
    password:{
        type:String
    },
    age:{
        type:Number,
        // min:18,
    },
    gender:{
        type:String,
        validate(v){
            if(!['M','F','Other'].includes(v)){
                throw new Error("Please enter correct gender");
                
            }
        }
    },
    photo:{
        type:String,
        default:"https://www.google.com/imgres?q=default%20photo%20image&imgurl=https%3A%2F%2Fs3.amazonaws.com%2F37assets%2Fsvn%2F765-default-avatar.png&imgrefurl=https%3A%2F%2Fsignalvnoise.com%2Fposts%2F3104-behind-the-scenes-reinventing-our-default-profile-pictures&docid=Bcplb9fZWTvvRM&tbnid=mFBeEI-GK2RjoM&vet=12ahUKEwjH3_ijzpqMAxWDSmwGHaraD6sQM3oECHkQAA..i&w=530&h=530&hcb=2&ved=2ahUKEwjH3_ijzpqMAxWDSmwGHaraD6sQM3oECHkQAA"
    },
    about:{
        type:String,
        default: "hello guys i am a good person and looking to make friends"
    },
    skills:{
        type:[String]
    },
    
    
},{timestamps:true})
module.exports=mongoose.model('User',userSchema)