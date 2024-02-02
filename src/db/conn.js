const mongoose = require('mongoose')

mongoose.connect(process.env.DB_PATH).then(()=>{
    console.log("DB connection sucessful")
}).catch((error)=>{
    console.log(error)
})
