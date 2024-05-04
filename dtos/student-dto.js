module.exports=class StudentDto{
    login;
    id;
 
    constructor(model){
     this.id=model._id;
     this.login=model.login;
    }
 }