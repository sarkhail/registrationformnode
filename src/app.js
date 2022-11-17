require('dotenv').config()
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
require("./db/conn");
const Register = require("./models/registers");
const hbs = require("hbs");
const path = require("path");
const { templates } = require("handlebars");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 5000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:false}));
app.set("view engine", "hbs");
app.use(express.static(static_path));
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res)=>{
    res.render("index");
})
app.get("/secret", (req, res)=>{
    console.log(`this the secret page cookie ${req.cookies.jwt}`);
    res.render("secret");
})

app.get("/register", (req, res)=>{
    res.render("register");
})

app.post("/register", async(req, res)=>{
    try{
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
    
    if(password == cpassword){
        const registerEmployee = new Register({

            firstname:req.body.firstname,
            lastname:req.body.lastname,
            age:req.body.age,
            phone:req.body.phone,
            email:req.body.email,
            password:password,
            confirmpassword:cpassword
        })      

        const token = await registerEmployee.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now()  + 30000), 
            httpOnly:true
        });
        console.log(cookie);

        const registered = await registerEmployee.save();
        res.status(201).render("index");
    }   
    }catch(error){
        res.status(400).send(error);
    }
})

app.get("/login", (req, res)=>{
    res.render("login");
})

app.post("/login", async(req, res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;

            const userEmail = await Register.findOne({email:email});

            const isMatch = await bcrypt.compare(password, userEmail.password);
            const token = await userEmail.generateAuthToken();
            res.cookie("jwt", token, {
                expires: new Date(Date.now()  + 500000), 
                httpOnly:true
                // only for https connections
               // secure:true 
            });

            console.log("the token par is" +token);
            if(isMatch){
                res.status(201).render("index")
            }else{
                res.status(400).send("Invalid Emial/Password")
            }
    }catch(e){
        res.status(400).send("Invalid Email");
    }
})



app.listen(port, ()=>{
    console.log(`Server is listening on the port number: ${port}`);
} )