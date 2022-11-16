
const mongoose = require("mongoose");

mongoose.connect(process.env.SECRET_DB, {
    useNewUrlParser:true,
    //useUnifiedTolpology:true,
   // useCreateIndex: true  
}).then(()=>{
    console.log("connection is successful");
}).catch((e)=>{
    console.log(e);
    console.log("No connection");
})