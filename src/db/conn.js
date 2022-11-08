const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/registation-api", {
    useNewUrlParser:true,
    //useUnifiedTolpology:true,
   // useCreateIndex: true  
}).then(()=>{
    console.log("connection is successful");
}).catch((e)=>{
    console.log(e);
    console.log("No connection");
})