const {Schema,model}=require('mongoose');

const CourseSchema=new Schema({
   name:{type:String, required:true, unique:true},
   description:{type:String, required:true},
   teacher:{type:String, required:true},
   student:[{type:Schema.Types.ObjectId, ref:'Student'}]
})

module.exports=model('Course', CourseSchema);