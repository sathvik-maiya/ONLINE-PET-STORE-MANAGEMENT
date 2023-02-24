const express=require("express");
const app=express();
const errormiddleware = require("./middleware/error");


app.use(express.json());

//route imports
const pets=require("./routes/petsroute.js");
const petfood=require("./routes/petfoodroute.js");
const petmedicine=require("./routes/petmedicineroute.js"); 
const pettoy=require("./routes/pettoyroute.js"); 


app.use("/api/v1",pets);
app.use("/api/v1",petfood);
app.use("/api/v1",petmedicine);
app.use("/api/v1",pettoy);

//middleware for errors
app.use(errormiddleware);





module.exports=app;