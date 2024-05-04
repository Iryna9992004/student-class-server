const CourseModel=require('../models/course-model');
const SheduleModel=require('../models/shedule-model');
const File=require('../models/file-model');
const StudentModel=require('../models/student-model');
const userModel = require('../models/user-model');
const Training=require('../models/training-file-model')
const { S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand, S3} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const StudentTraining=require('../models/student-training-model');
const StudentFile=require('../models/student-file-model')

class DeleteController{
    async deleteShedules(req,res,next){
        try{
           const {teacher}=req.cookies;
           await SheduleModel.deleteMany({teacher});
           res.json({message:"Successfuly deleted shedule"})
        }
        catch(e){
            next(e);
        }
    }

    async deleteHomework(req, res, next) {
        try {
          const s3Client = new S3Client({
            credentials: {
              accessKeyId: process.env.ACCESS_KEY,
              secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
            region: 'eu-central-1'
          });
      
          const { teacher } = req.cookies;
          const homeworksToDelete = await File.find({ teacher });
      
          for (const item of homeworksToDelete) {
            const getObjectParams = {
              Bucket: process.env.BUCKET_NAME,
              Key: item.url
            };
      
            const deleteParams = {
              Bucket: process.env.BUCKET_NAME,
              Key: item.url
            };
      
            const deleteCommand = new DeleteObjectCommand(deleteParams);
            await s3Client.send(deleteCommand);
            
            
            const sent=await StudentFile.find({parentHomework:item._id});
            for(const i of sent){

              const deleteParams1= {
                Bucket: process.env.BUCKET_NAME,
                Key: i.url
              };
              const deleteCommand = new DeleteObjectCommand(deleteParams1);
              await s3Client.send(deleteCommand);

              await StudentFile.findByIdAndDelete(i._id);
            }
            await File.findOneAndDelete({ _id: item._id });
          }
      
          return res.json({ message: 'Trainings deleted successfully' });
        } catch (e) {
          next(e);
        }
      }
      

    async deleteStudents(req,res,next){
        try{
           const {teacher}=req.cookies;
           await StudentModel.deleteMany({teacher});
           res.json({message:"Successfuly deleted shedule"})
        }
        catch(e){
            next(e);
        }
    }

    async deleteCourses(req,res,next){
        try{
            const {teacher}=req.cookies;
            await CourseModel.deleteMany({teacher});
           res.json({message:"Successfuly deleted"})
        }
        catch(e){
            next(e);
        }
    }

    async deleteTrainings(req,res,next){
      try{
        try {
          const s3Client = new S3Client({
            credentials: {
              accessKeyId: process.env.ACCESS_KEY,
              secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
            region: 'eu-central-1'
          });
      
          const { teacher } = req.cookies;
          const homeworksToDelete = await Training.find({ teacher });
      
          for (const item of homeworksToDelete) {
            const getObjectParams = {
              Bucket: process.env.BUCKET_NAME,
              Key: item.url
            };
      
            const deleteParams = {
              Bucket: process.env.BUCKET_NAME,
              Key: item.url
            };
      
            const deleteCommand = new DeleteObjectCommand(deleteParams);
            await s3Client.send(deleteCommand);
            
            await Training.findOneAndDelete({ _id: item._id });
            const sent=await StudentTraining.find({parentTraining:item._id});
            for(const i of sent){
              const deleteParams1 = {
                Bucket: process.env.BUCKET_NAME,
                Key: item.url
              };
              const deleteCommand = new DeleteObjectCommand(deleteParams1);
              await s3Client.send(deleteCommand);

              await StudentTraining.findByIdAndDelete(i._id);
            }
          }
      
          return res.json({ message: 'Homeworks deleted successfully' });
        } catch (e) {
          next(e);
        }
      }
      catch(e){
        next(e);
      }
    }

    async deleteAccount(req,res,next){
      const s3Client = new S3Client({
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: 'eu-central-1'
      });
        try{
            const {teacher}=req.cookies;
            await CourseModel.deleteMany({teacher});
            await StudentModel.deleteMany({teacher});
            await SheduleModel.deleteMany({teacher});
            
            const homeworksToDelete = await File.find({ teacher });
            const trainingsToDelete = await Training.find({ teacher });

            for (const item of homeworksToDelete) {
              const getObjectParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: item.url
              };
        
              const deleteParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: item.url
              };
        
              const deleteCommand = new DeleteObjectCommand(deleteParams);
              await s3Client.send(deleteCommand);
              
              await File.findOneAndDelete({ _id: item._id });

              const sent=await StudentFile.find({parentHomework:_id});
              for(i of sent){
                const deleteParams1 = {
                  Bucket: process.env.BUCKET_NAME,
                  Key: i.url
                };
                const deleteCommand1 = new DeleteObjectCommand(deleteParams1);
                await s3Client.send(deleteCommand1);
                await StudentFile.findByIdAndDelete({_id:i._id});
              }

            await userModel.findOneAndDelete({email:teacher});
            res.json({message:"Successfuly deleted"});
            }
            
            for (const item of trainingsToDelete) {
              const getObjectParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: item.url
              };
        
              const deleteParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: item.url
              };
        
              const deleteCommand = new DeleteObjectCommand(deleteParams);
              await s3Client.send(deleteCommand);
              
              await Training.findOneAndDelete({ _id: item._id });
              const s=await StudentTraining.find({parentTraining:_id});
              for(const it of s){
                const deleteParams2 = {
                  Bucket: process.env.BUCKET_NAME,
                  Key: it.url
                };
                const deleteCommand2 = new DeleteObjectCommand(deleteParams2);
                await s3Client.send(deleteCommand2);
                await StudentTraining.findByIdAndDelete({_id:i._id});
              }
           
            }
            await userModel.findOneAndDelete({email:teacher})
            res.clearCookie('refreshToken');
            res.clearCookie('teacher');
            res.clearCookie('id');
            res.clearCookie('email');
  
            res.json({message:"Account deleted succesfully"})
        }
        catch(e){
            next(e);
        }
    }
}

module.exports=new DeleteController();