const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
  try {
    // validation of the users
    validateSignUpData(req);

    // encryption using bcrypt
    const { password, firstName, lastName, emailId } = req.body; // get the password and other from the database
    const PasswordHash = await bcrypt.hash(password, 10);
    // console.log(PasswordHash);

    // const user=new User(req.body)  This is wrong practice , we should not use like this see below how to create instance of  user model

    const user = new User({
      // So this allows only the thing we want , if user tries to send any other thing let's say xyz:12 it will not take it
      firstName,
      lastName,
      emailId,
      password: PasswordHash,
    });

    // 11/4/25 we have come from last ep19 to create cookiejwt for frontend don't write this  when you are just building backend logic
    const savedUser = await user.save();
    const token = await user.getJwt(); // this get the creating the jwt

    // Server is creating the cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // important for localhost
      sameSite: "Lax",
    });
// till here from line 29-39 on  11/4/25
    res.json({ message: "database created successfully", data: savedUser });
  } catch (error) {
    res.status(403).send("hey gaurav error occured : " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Incorrect email , please enter the correct");
    }
    // i have created this  of user instance method
    const ispasswordValid = await user.validatePassword(password);
    // date 22/3/25 ,const ispasswordValid= await bcrypt.compare(password,user.password) , date -> 23/3/25 This is went to now userschema instance methods
    if (ispasswordValid) {
      const token = await user.getJwt(); // this get the creating the jwt

      // Creating a jwt token

      // date 22/3/25 const token= await jwt.sign({_id:user._id},"Gaurav@123") ,date -> 23/3/25 you can go to the user schema can find this there , we have offloaded thisone
      console.log(token);

      // Server is creating the cookie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false, // important for localhost
        sameSite: "Lax",
      });
      res.send(user);
    } else {
      throw new Error("wrong password");
    }
  } catch (error) {
    res.status(439).send("gaurav error : " + error.message);
  }
});
// logout api
authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, { expires: new Date(Date.now()) })
    .send("Logout successful Gaurav");
  // This is another method by which you can logout
  // res.clearCookie('token').send('hello logout hogya')
});

module.exports = authRouter;
