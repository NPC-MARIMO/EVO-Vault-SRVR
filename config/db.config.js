const mongoose = require('mongoose')

const connectDB = async () => {
   await mongoose
   .connect(process.env.MONGO_URI)
   .then( () => console.log('connected to db'))
   .catch( err => console.log(err))

}
module.exports = connectDB