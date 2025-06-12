require('dotenv').config()
const express = require('express')
const connectDB = require('./config/db.config')
const app = express()

connectDB()

const port = process.env.PORT 

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen((port), () => console.log(`Example app listening on port ${port}`))  