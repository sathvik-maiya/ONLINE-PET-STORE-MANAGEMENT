const express=require("express");
const app=express();
const errormiddleware = require("./middleware/error");


app.use(express.json());

//route imports
const pets=require("./routes/petsroute.js");


app.use("/api/v1",pets);

//middleware for errors
app.use(errormiddleware);





module.exports=app;