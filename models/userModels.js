const mongoose = require('mongoose');
const validator = require('validator');
const { validate } = require('./tourModels');
const bcrypt = require('bcryptjs');
// name,email,photo,password,passwordConfirm

const userSchema = new mongoose.Schema({
        name:{
            type:String,
            requied:[true,'please tell us your name!']
        },
        email:{
            type:String,
            required:[true,'please provide a valid email'],
            unique:true,
            lowercase:true,
            validate:[validator.isEmail,'Please provide a valid email']
        },
        photo:String,
        password:{
            type:String,
            required:[true,'Please provide a password'],
            minlength:8
        },
        passwordConfirm:{
            type:String,
            required:[true,'Please confirm your password!'],
            validate:{
                //this only works on create and save!
                validator:function(el){
                    return el === this.password;
                },
                message:'passwords are not the same'
            }
        }
});

userSchema.pre('save',async function(next){
    //only run this function if password was actually modified
if(!this.isModified('password')) return next();
//Hash the password with cost of 12
this.password = await bcrypt.hash(this.password,12);
//delete the passwordConfirm field
this.passwordConfirm = undefined;
next();
});

const User = mongoose.model('User',userSchema);

module.exports = User;