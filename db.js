const mongoose =require("mongoose");

var mongoURL='mongodb+srv://arav:arav1@cluster0.aq8b8d4.mongodb.net/StayInn'
 
mongoose.connect(mongoURL,{useUnifiedTopology : true,useNewUrlParser: true})

var connection = mongoose.connection

connection.on('error', () =>{
    console.log("Mongo DB connection failed")
})

connection.on('connected', () =>{
    console.log("Mongo DB connection Successful")
})

module.exports = mongoose
