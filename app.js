const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const cookieparser=require('cookie-parser')
const jwt= require('jsonwebtoken')
const connectDB = require("./src/config/database");
const User = require("./src/models/user");
const {userAuth}=require('./src/middlewares/auth')
app.use(express.json());
app.use(cookieparser())
const { validateSignUpData } = require("./src/utils/validation");

app.post("/signup", async (req, res) => {
  try {
    // validation of the users
    validateSignUpData(req);

    // encryption using bcrypt
    const { password, firstName, lastName, emailId } = req.body; // get the password and other from the database
    const PasswordHash = await bcrypt.hash(password, 10);
    // console.log(PasswordHash);

    // const user=new User(req.body)  This is wrong practice , we should not use like this see below how to create instance of  user model

    const user = new User({         // So this allows only the thing we want , if user tries to send any other thing let's say xyz:12 it will not take it 
      firstName,
      lastName,
      emailId,
      password: PasswordHash,
    });
    await user.save();
    res.send("database created successfully");
  } catch (error) {
    res.status(403).send("hey gaurav error occured : " + error.message);
  }
});
  // Compare the passwords using login
app.post('/login', async (req,res)=>{
   try {
    const {emailId,password}= req.body
    const user= await User.findOne({emailId:emailId})
    if(!user){
        throw new Error("Incorrect email , please enter the correct");        
    }
    // i have created this  of user instance method 
    const ispasswordValid= await user.validatePassword(password)
    // date 22/3/25 ,const ispasswordValid= await bcrypt.compare(password,user.password) , date -> 23/3/25 This is went to now userschema instance methods 
    if(ispasswordValid){
            
          const token= await user.getJwt()  // this get the creating the jwt
      
            // Creating a jwt token

            // date 22/3/25 const token= await jwt.sign({_id:user._id},"Gaurav@123") ,date -> 23/3/25 you can go to the user schema can find this there , we have offloaded thisone
            console.log(token);
            

            // Server is creating the cookie 
        res.cookie("token",token)
        res.send('Yes gaurav ,password is correct')
    }
    else{
        throw new Error("wrong password")
    }
   } catch (error) {
            res.status(439).send("gaurav error : "+error.message)
   }
})
// cookie-parser
app.get('/profile',userAuth,async (req,res)=>{
       try {
        const user=req.user
       res.send(user);
       } catch (error) {
        res.status(340).send('please gaurav enter correct details')
       }
       
        // console.log(cookiei);
        // res.send('reading cookies')
        
})

// Date 23/3/25  Send connection request
app.post('/sendconnectionreq',userAuth, async (req,res)=>{
   const user=req.user
  res.send('Connection request sent by '+ user.firstName)
})



// find by email the id
app.get("/user", async (req, res) => {
  const Useremail = req.body.emailId;
  try {
    const users = await User.find({ emailId: Useremail });
    if (users.length === 0) {
      res.status(404).send("error occured gaurav");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(404).send("error occured gaurav");
  }
});

// feed - find every name

app.get("/feed", async (req, res) => {
  try {
    const h = await User.find({});
    res.send(h);
  } catch (error) {
    res.status(404).send("error occured gaurav");
  }
});
// find the unquie email by using the findOne

app.get("/findemail", async (req, res) => {
  const useremail = req.body.emailId;
  try {
    console.log(useremail);
    const users = await User.findOne({ emailId: useremail });

    res.send(users);
  } catch (error) {
    res.status(404).send("gaurav error occuerd");
  }
});
// delete a user by its id
app.delete("/deleteuser", async (req, res) => {
  const userid = req.body.userId;
  try {
    const deleted_user = await User.findByIdAndDelete(userid);
    res.send("user is deleted gaurav");
  } catch (error) {
    res.status(499).send("errror occured gaurav");
  }
});
// find by id and update
app.patch("/update", async (req, res) => {
  const userid = req.body.userId;
  const data = req.body;
  const skill = req.body.skills;
  try {
    const updateAllowed = ["gender", "age", "userId", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      updateAllowed.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("update not allowed gaurav");
    }
    const lenskill = skill.length;
    if (lenskill != 3) {
      throw new Error("please enter only 3 skills");
    }

    const update = await User.findByIdAndUpdate(userid, data, {
      returndocument: "after",
      runValidators: true,
    });
    res.send("updated successfully");
  } catch (error) {
    console.log(error);

    res.status(333).send("error gaurav has been occured");
  }
});

connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => {
      console.log("port is successfully connected");
    });
  })
  .catch((error) => {
    console.error("database not connected successfully");
  });
