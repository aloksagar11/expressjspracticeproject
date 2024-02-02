const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const employeeSchema = mongoose.Schema({
    firstname:{
        type: String,
        required : true
    },
    lastname:{
        type: String,
        required : true
    } ,
    email:{
        type: String,
        required : true,
        unique:true
    },
    gender :{
        
        type : String,
        required : true   
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    age:{
        type:Number,
        required : true
    },
    password : {
        type:String,
        required: true
    },
    cpassword :{
        type: String,
       
    },
    tokens:[{
        token:{
            type: String,
            required: true,
        }

    }]

})


employeeSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token});
        await this.save();
        console.log(token)
        return token;
    } catch (error) {
        console.log('this is error');
        console.log(error)

        
    }
}

employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
        console.log(`current password ${this.password}`);
        this.password = await bcrypt.hash(this.password,10);
        console.log(`current password ${this.password}`);
        this.cpassword = undefined;
    }
    next();
})

const registerEmployee = mongoose.model('registeredEmployee',employeeSchema);

module.exports = registerEmployee;