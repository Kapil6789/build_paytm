import express from "express"
import 'dotenv/config'
import cors from "cors"
const app=express()
import mainRouter from "./backend/routes/index.js"
import cookieParser from "cookie-parser"

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
      .split(",")
      .map((value) => value.trim());

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Origin is not allowed by CORS"));
  },
  credentials: true
}));
// app.use( (req,res,next)=>{ res.header('Access-Control-Allow-Origin', '*');  // Allow all origins
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
//   // Allow credentials (cookies, HTTP authentication)
//   res.header('Access-Control-Allow-Credentials', true);
//   next()
// })
app.use('/api/v1',mainRouter)

const port = process.env.PORT || 8000;
app.listen(port, "0.0.0.0", () => {
    console.log(`server is running on port ${port}`)
})
