const {Schema,model}=require('mongoose');

const SheduleSchema=new Schema({
   date:{type:Date,required:true},
   name:{type:String,required:true},
   description:{type:String},
   course:{type:String, required:true},
   teacher:{type:String,required:true}
})

module.exports=model('Shedule',SheduleSchema);