const StudentUserService=require('../service/student-user-service')
const StudentModel=require('../models/student-model')

class StudentUserController{
    async login(req,res,next){
     try{
      const {login,password}=req.body;
      const studentData=await StudentUserService.login(login,password);
      const student=await StudentModel.findOne({login})
      res.cookie('refreshToken', studentData.refreshToken,{maxAge:30*24*60*60*1000, httpOnly: true});
      res.cookie('login', studentData.user.login,{maxAge:30*24*60*60*1000, httpOnly: true});
      res.cookie('teacher',student.teacher, {maxAge:30*24*60*60*1000, httpOnly:true});
      return res.json(studentData);
     }
     catch(e){
      next(e);
     }
    }

    async logout(req,res,next){
      try{
        const {refreshToken}=req.cookies;
        const token=await StudentUserService.logout(refreshToken);
        res.clearCookie('refreshToken');
        res.clearCookie('teacher');
        res.clearCookie('login');
        return res.json(token);
      }
      catch(e){
        next(e);
      }
    }
    
    async refresh(req,res,next){
        try{
         const {refreshToken}= req.cookies;
         const userData=await StudentUserService.refresh(refreshToken);
         res.cookie('refreshToken', userData.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true});
         return res.json(userData);
        }
        catch(e){
          next(e);    
        }
    }
}

module.exports=new StudentUserController();