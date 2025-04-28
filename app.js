const express = require("express");
const app = express();
const cookieparser=require('cookie-parser')
const connectDB = require("./src/config/database");
const cors=require('cors')
require('dotenv').config()

// this cors we are coming from frontend 2/4/25
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",  // Localhost for development
      "https://dev-tinder-web-zeta.vercel.app"  // Vercel frontend
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,  // If you need to send cookies or authorization headers
}));
app.use(express.json());
app.use(cookieparser())

const authRouter=require('./src/routes/auth')
const profileRouter=require('./src/routes/profile')
const requestRouter=require('./src/routes/request');
const userRouter = require('./src/routes/user')


app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)


app.use('/', userRouter)



connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(5000, () => {
      console.log("port is successfully connected");
    });
  })
  .catch((error) => {
    console.error("database not connected successfully");
  });
