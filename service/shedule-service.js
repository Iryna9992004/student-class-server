const SheduleModel=require('../models/shedule-model');

class SheduleService{
    
  async addShedule(date,name,description,course,teacher){
    const sheduleItem=await SheduleModel.create({date,name,description,course,teacher});
    return {...sheduleItem};
  }

  async sheduleList(teacher){
    const shedule=await SheduleModel.find({teacher});
    return shedule;
  }

  async deleteShedule(_id){
    const shedule=await SheduleModel.deleteOne({_id});
    return shedule;
  }
  
  async editShedule(_id,newDate,newName,newDescription,newCourse){
    const shedule=await SheduleModel.findByIdAndUpdate({_id:_id},{date:newDate,name:newName,description:newDescription,course:newCourse})
    return shedule;
  }
}

module.exports=new SheduleService();