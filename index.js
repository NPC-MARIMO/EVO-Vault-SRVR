require('dotenv').config()
const express = require('express')
const app = express()

const connectDB = require('./config/db.config')
connectDB()

const cors = require('cors')    
const cookieParser = require('cookie-parser')

const authRouter = require('./routes/user.route')


const port = process.env.PORT 

app.use(cors());

app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRouter); 


app.listen((port), () => console.log(`Example app listening on port ${port}`))  