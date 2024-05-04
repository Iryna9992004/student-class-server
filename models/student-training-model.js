const {Schema, model} =require('mongoose');

const StudentTrainingSchema=new Schema({
   name:{type:String, required:true},
   student:{type:String, required:true},
   bucket:{type:String, required:true},
   url:{type:String, required:true},
   parentTraining:{type:String,required:true},
   grade:{type:String,default:'0'},
   teacher:{type:String,required:true},
   type:{type:String,default:"training"}
})

module.exports=model('StudentTraining',StudentTrainingSchema);