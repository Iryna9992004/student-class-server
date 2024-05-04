const sheduleService=require('../service/shedule-service')

class SheduleController{
  async addShedule(req,res,next){
    try{
      const {date,name,description,course}=req.body;
      const {teacher}=req.cookies;
      const shedule=await sheduleService.addShedule(date,name,description,course,teacher);
      return res.json(shedule);
    }
    catch(e){
      next(e);
    }
  }
  async sheduleList(req,res,next){
    try{
      const {teacher}=req.cookies;
      const shedules=await sheduleService.sheduleList(teacher);
      return res.json(shedules);
    }
    catch(e){
      next(e);
    }
  }
  async deleteShedule(req,res,next){
    try{
     const {_id}=req.body;
     const shedule=await sheduleService.deleteShedule(_id);
     return res.json(shedule);
    }
    catch(e){
      next(e);
    }
  }

  async editShedule(req,res,next){
    try{
     const {_id,newDate,newName, newDescription,newCourse}=req.body;
     const edit=await sheduleService.editShedule(_id,newDate,newName,newDescription,newCourse);
     return res.json(edit);
    }
    catch(e){
      next(e);
    }
  }
}
module.exports=new SheduleController();