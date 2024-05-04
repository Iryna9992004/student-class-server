const ApiError = require('../exceptions/api-error');
const StudentModel=require('../models/student-model');
const bcrypt=require('bcrypt');
const StudentDto=require('../dtos/student-dto');
const tokenService=require('../service/token-service')

class StudentUserService{
  async login(login,password){
    const student=await StudentModel.findOne({login});
    if(!student){
        throw ApiError.BadRequest("Student doesn`t exist");
    }
    const isPassEquals=bcrypt.compare(password,student.password);
    if(!isPassEquals){
        throw ApiError.BadRequest("Wrong password");
    }
    const userDto=new StudentDto(student);

    const tokens=tokenService.generateTokens({...userDto});
    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens,user:userDto}
  }

  async logout(refreshToken){
    const token=await tokenService.removeToken(refreshToken);
    return token;
  }

  async refresh(refreshToken){
    if(!refreshToken){
        throw ApiError.UnauthorizedError();
    }
    const userData=tokenService.validateRefreshToken(refreshToken);
      const tokenFromDb=await tokenService.findToken(refreshToken);
    if(!userData || !tokenFromDb){
        throw ApiError.UnauthorizedError();
    }
    const user=await StudentModel.findById(userData.id);
    const userDto=new StudentDto(user);
    const tokens=tokenService.generateTokens({...userDto});

    await tokenService.saveToken(userDto.id, tokens.refreshToken);
    return {...tokens,user:userDto};
    
  }

}
module.exports=new StudentUserService();