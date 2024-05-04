const {Schema, model}=require('mongoose');

const StudentSchema=new Schema({
    name:{type:String, required:true},
    login:{type:String,required:true,unique:true},
    password:{type:String, required:true},
    course:{type:String, required:true},
    teacher:{type:String,required:true}
});

module.exports=model('Student', StudentSchema)