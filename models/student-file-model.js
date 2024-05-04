const {Schema,model}=require('mongoose');

const StudentFileSchema=new Schema({
   name:{type:String, required:true},
   student:{type:String, required:true},
   bucket:{type:String, required:true},
   url:{type:String, required:true},
   parentHomework:{type:String,required:true},
   grade:{type:String,default:0},
   teacher:{type:String,required:true}
})

module.exports=model('StudentFile', StudentFileSchema);