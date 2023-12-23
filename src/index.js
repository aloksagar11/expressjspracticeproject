const express = require('express');
const hbs = require('hbs')
const path = require('path');
const port =  process.env.PORT ||3000;
const app = express();

// const staticPath = path.join(__dirname,"../public")

const templatePath = path.join(__dirname,"../templates/views")
const partialPath = path.join(__dirname,"../templates/partials")

 

app.set('view engine','hbs')
app.set("views",templatePath);
hbs.registerPartials(partialPath)

app.get("/",(req,resp)=>{
    // resp.send("the homepage")
    resp.render('index')
})

app.get("/about",(req,resp)=>{
    resp.send("This is about page")

})

app.listen(port,()=>{
    console.log(`Connection is running on port ${port }`)
})