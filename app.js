const express = require("express");
const app = express();
const cookieparser=require('cookie-parser')
const connectDB = require("./src/config/database");
app.use(express.json());
app.use(cookieparser())

const authRouter=require('./src/routes/auth')
const profileRouter=require('./src/routes/profile')
const requestRouter=require('./src/routes/request')


app.use('/', authRouter)
app.use('/', profileRouter)
app.use('/', requestRouter)



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
