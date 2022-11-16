const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const employeeSchema = new mongoose.Schema ({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        unique:true,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    },
    tokens: [{
        token:{
            type:String,
            required:true
        }

    }]
})

//generating token
employeeSchema.methods.generateAuthToken = async function(){
try{
    const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({token:token});
    await this.save();
    return token;
}catch(error){
    res.send("the error part" + error);
    console.log("the error par is " + error);
}
}

//generating password into hash

employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){ 
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmpassword = await bcrypt.hash(this.password, 10);
    
    }

    next();
})

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
