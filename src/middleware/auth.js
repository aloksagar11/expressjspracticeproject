const jwt = require('jsonwebtoken')
const registerEmployee = require('../models/resisters');
const { log } = require('console');

const auth = async (req,res, next)=>{
    try {
        const token = req.cookies.jwt;
        // console.log(`this is token ${token}`);
        const verifyUser = jwt.verify(token,process.env.SECRET_KEY)
        const user = await registerEmployee.findOne({_id:verifyUser._id});
        
        next();
        
    } catch (error) {
        console.log("Bhai pahle error thik kar\n")
        // alert('login again')
        res.status(401).redirect('/login');
    }
}

module.exports = auth;