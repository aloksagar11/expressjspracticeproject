require('dotenv').config();
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const port = process.env.PORT || 3000;
require('./db/conn');
const registerEmployee = require('./models/resisters')
const bcrypt = require('bcryptjs')
const app= express();
const staticPath = path.join(__dirname,"../public")
// app.use('/public', express.static(path.join(__dirname, 'public'), { 'extensions': ['css'] }));
const templatePath = path.join(__dirname,"../templates/views")
const partialsPath = path.join(__dirname,"../templates/partials")


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.set('view engine','hbs')
app.set("views",templatePath) 
hbs.registerPartials(partialsPath);

app.use('/public',express.static(staticPath,{ 'extensions': ['css'] }))
    
app.get("/",(req,resp)=>{
    // resp.send("this is home page from main file")\
    resp.render('index')
})

app.get("/register",(req,resp)=>{
    resp.render('register')})

app.get("/about",(req,resp)=>{
    resp.send("This is about")
})


app.get("/login",(req,resp)=>{
    resp.render('login')
})

app.post('/login',async(req,resp)=>{
    try {
        const userData = await registerEmployee.findOne({email:req.body.email});
        const userPassword = req.body.password;
        // console.log(userPassword)
        // console.log(userData)

        const password = await bcrypt.compare(userPassword,userData.password)
        const token = await userData.generateAuthToken();
        console.log(token)
        if(password)
            resp.redirect('/')
        else
            resp.send('password is not matching');

    } catch (error) {
            resp.status(400).send("invalid login credentials")
    }
})

//getting form data from UI
app.post("/register",async(req,resp)=>{
    
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;


        if(cpassword===password){
            const firstname= req.body.fname;
            const lastname= req.body.lname;
            const age= req.body.age;
            const email = req.body.email;
            const phone  = req.body.phone;
            const gender = req.body.gender;


            const registerNewEmp = new registerEmployee({
                firstname,lastname,age,email,phone,gender,password,cpassword
            })

            const token = await registerNewEmp.generateAuthToken();

            
            const result = await registerNewEmp.save();
            if (result)
                resp.redirect('/login')
            else
                resp.render('/register')
        }
        else
            resp.send("Password is not matching ")
        
    } catch (error) {
        console.log(error)

    }
})


app.get('/search',(req,resp)=>{
    
    resp.render('searchEmp');
})

app.get('/search/:id',async(req,resp)=>{
    const result = await registerEmployee.find({firstname:req.params.id})
    if(result.length)
        resp.render('searchEmp',{emp:result[0]})
    else
        resp.send("Data Not Found")
})

app.post('/search',async(req,resp)=>{
    const searchValue = req.body.search;
    resp.redirect(`search/${searchValue}`)

})

app.listen(port,()=>{
    console.log(`Connection is running on port ${port} successfully`);
})