import express from "express"
import 'dotenv/config'
import cors from "cors"
const app=express()
import mainRouter from "./backend/routes/index.js"
import cookieParser from "cookie-parser"

app.use(express.json())
app.use(cookieParser())
app.use( (req,res,next)=>{ res.header('Access-Control-Allow-Origin', '*');  // Allow all origins
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Allow credentials (cookies, HTTP authentication)
  res.header('Access-Control-Allow-Credentials', true);
  next()
})
app.use('/api/v1',mainRouter)

app.listen(process.env.PORT,()=>{
    console.log("server is running")
})