const ApiError = require('../exceptions/api-error');
const userService =require('../service/user-service');
const {validationResult}=require('express-validator');

class UserController{

    async registration(req,res,next){
        try{
           const errors=validationResult(req);
           if(!errors.isEmpty()){
             return next(ApiError.BadRequest('Validation error', errors.array()));
           }
           const {email, password}=req.body;
           const userData=await userService.registration(email, password);
          
           res.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000, httpOnly: true});
           res.cookie('teacher', email, {maxAge:30*24*60*60*1000, httpOnly:true});
           
           return res.json(userData);
        }
        catch(e){
          next(e);
        }
    }

    async login(req,res,next){
        try{
          const {email,password}=req.body;
          const userData=await userService.login(email, password);
          res.cookie('refreshToken', userData.refreshToken,{maxAge:30*24*60*60*1000, httpOnly: true});
          res.cookie('teacher', email, {maxAge:30*24*60*60*1000, httpOnly:true});
          return res.json(userData);
        }
        catch(e){
         next(e);
        }
    }

    async logout(req,res,next){
        try{
          const {refreshToken}=req.cookies;
          const token=await userService.logout(refreshToken);
          res.clearCookie('refreshToken');
          res.clearCookie('teacher');
          return res.json(token);
        }
        catch(e){
         next(e);
        }
    }

    async activate(req,res,next){
        try{
          const activationLink=req.params.link;
          await userService.activate(activationLink);
          return res.redirect('https://www.studentclass.org')
        }
        catch(e){
         next(e);
        }
    }

    async refresh(req, res, next){
        try{
          const {refreshToken}= req.cookies;
          const userData=await userService.refresh(refreshToken);
          res.cookie('refreshToken', userData.refreshToken, {maxAge:30*24*60*60*1000, httpOnly: true});
          return res.json(userData);
        }
        catch(e){
         next(e);
        }
    }

    async getUsers(req,res,next){
        try{
         const users=await userService.getAllUsers();
         return res.json(users);
        }
         catch(e){
         next(e);
        }
    }

    async addCourse(req,res,next){
        try{
          const {teacher}=req.cookies;
          const {name,description}=req.body;
          const course=await userService.addCourse(name,description,teacher);
          return res.json(course);
        }
        catch(e){
         next(e);
        }
    }

    async findCourses(req,res,next){
      try{
        const {teacher}=req.cookies;
        const courses=await userService.courseList(teacher);
        return res.json(courses);
      }
      catch(e){
        next(e);
      }
    }

    async editCourse(req,res,next){
      try{
        const {name,newName,newDescription}=req.body;
        const course=await userService.editCourse(name,newName,newDescription);
        return res.json(course);
      }
      catch(e){
        next(e);
      }
    }
    async deleteCourse(req,res,next){
      try{
        const {name}=req.body;
        const course=await userService.deleteCourse(name);
        return res.json(course);
      }
      catch(e){
        next(e);
      }
    }
}

module.exports=new UserController();