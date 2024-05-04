const studentService=require('../service/student-service')

class StudentController{
   async addStudent(req,res,next){
     try{
       const {teacher}=req.cookies;
       const {name,login,password,course}=req.body;
       const student=await studentService.addStudent(name,login,password,course,teacher);
       return res.json(student);
     }
     catch(e){
        next(e);
     }
   }

   async studentList(req,res,next){
    try{
      const {teacher}=req.cookies;
      const stud=await studentService.students(teacher);
      return res.json(stud);
    }
    catch(e){
      next(e);
    }
   }

   async deleteStudent(req,res,next){
    try{
     const {_id}=req.body;
     const stud=await studentService.deleteStudent(_id);
     return res.json(stud);
    }
    catch(e){
      next(e);
    }
   }

   async editStudent(req,res,next){
    try{
      const {_id,newName,newLogin,newPassword,newCourse}=req.body;
      const student=await studentService.editStudent(_id,newName,newLogin,newPassword,newCourse);
      return res.json(student);
    }
    catch(e){
      next(e);
    }
   }
}
module.exports=new StudentController();