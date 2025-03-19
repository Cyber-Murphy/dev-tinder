const express=require('express')
const app=express()

app.use( '/',(req,res)=>{
    res.send('hello from the sejjjrver my friend')
})
app.use('/test',(req,res)=>{
    res.send('yo yo honney singh')
})
app.listen(3000, ()=>{
    console.log('port is successfully connected');
    
})