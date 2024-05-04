const {Schema, model} =require('mongoose');

const TrainingSchema=new Schema({
    name:{type:String, required:true},
    bucket:{type:String, required:true},
    url:{type:String, required:true},
    description:{type:String},
    course:{type:String,required:true},
    teacher:{type:String,required:true},
    type:{type:String, default:'training'}
})

module.exports=model('Training',TrainingSchema);