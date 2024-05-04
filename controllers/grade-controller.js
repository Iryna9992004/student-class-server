const StudentModel=require('../models/student-file-model');
const StudentTraining=require('../models/student-training-model');


class GradeController{
    async addGradeHomework(req,res,next){
      try{
        const {_id,newGrade}=req.body;
        const graded=await StudentModel.findByIdAndUpdate(_id,{grade:newGrade})
        res.json(graded);
      }
      catch(e){
        next(e);
      }
    }
    async addGradeTraining(req,res,next){
        try{
         const {_id,newGrade}=req.body;
         const graded=await StudentTraining.findByIdAndUpdate(_id,{grade:newGrade});
         res.json(graded);
        }
        catch(e){
         next(e);
        }
    }

    async deleteHomeworkGrade(req,res,next){
      try{
        const {_id}=req.body;
        const deleted=await StudentModel.findByIdAndDelete(_id);
        res.json(deleted);
      }
      catch(e){
        next(e);
      }
    }

    async deleteTrainingGrade(req,res,next){
      try{
        const {_id}=req.body;
        const deleted=await StudentTraining.findByIdAndDelete(_id);
        res.json(deleted);
      }
      catch(e){
        next(e);
      }
    }
}

module.exports=new GradeController;