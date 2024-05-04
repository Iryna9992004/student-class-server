const StudentModel=require('../models/student-model')
const ApiError=require('../exceptions/api-error');
const studentModel = require('../models/student-model');
const bcrypt=require('bcrypt');

class StudentService{
  async addStudent(name,login,password,course,teacher){
    const candidate=await StudentModel.findOne({login});
    if(candidate){
        throw ApiError.BadRequest('Student with this login already exist');
    }
    const hashPassword=await bcrypt.hash(password,4);
    const student=await StudentModel.create({name,login,password:hashPassword,course,teacher});
    return student;
  }

  async students(teacher){
    const students=await studentModel.find({teacher});
    return students;
  }

  async deleteStudent(_id){
    const student=await studentModel.deleteOne({_id});
    return student;
  }

  async editStudent(_id,newName,newLogin,newPassword,newCourse){
   const student=await studentModel.findOneAndUpdate({_id:_id},{name:newName,login:newLogin,password:newPassword,course:newCourse});
   return student;
  }
}

module.exports=new StudentService();