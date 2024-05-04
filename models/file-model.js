const {Schema,model}=require('mongoose');

const FileSchema=new Schema({
   name:{type:String, required:true},
   bucket:{type:String, required:true},
   url:{type:String, required:true},
   description:{type:String},
   course:{type:String,required:true},
   teacher:{type:String,required:true}
})

module.exports=model('File', FileSchema);