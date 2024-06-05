const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt")

const userSchema = new Schema({
    email:{
        type:String,
        required:[true , "plz enter email"],
        lowercase : true,
        unique:true
    },
    password:{
        type:String,
        required : [true , "plz enter the password"]
    }
});

userSchema.pre('save',async function(next){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(this.password,salt);
        this.password = hashPassword;
        next()
    }catch(err){
        next(err);
    }
})

// userSchema.method.isValidPassword = async function(password){
//     try {
//         return await bcrypt.compare(password,this.password);
//     } catch (error) {
//         throw error
//     }
// }

const User = mongoose.model('user',userSchema);
module.exports = User