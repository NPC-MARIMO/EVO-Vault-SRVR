require('dotenv').config()
const express = require('express')
const app = express()

const connectDB = require('./config/db.config')
connectDB()

const cors = require('cors')    
const cookieParser = require('cookie-parser')

const authRouter = require('./routes/user.route')
const profileRouter = require('./routes/profile.route')
const familyRouter = require('./routes/family.route')
const requestRouter = require('./routes/request.route')
const mediaRouter = require('./routes/media.route')
const forgotPassRouter = require('./routes/forgotpass.route')


const port = process.env.PORT

app.use(
  cors({
    origin: true, // allow origin to be reflected back
    credentials: true,
  })
);



app.use(cookieParser());
app.use(express.json());


app.use("/api/auth", authRouter); 
app.use("/api/profile", profileRouter);
app.use('/api/family', familyRouter);
app.use('/api/request', requestRouter);
app.use('/api/memory', mediaRouter);
app.use("/api/password", forgotPassRouter);


app.listen((port), () => console.log(`Example app listening on port ${port}`))      