const File=require('../models/file-model');
const StudentFile=require('../models/student-file-model')
const uuid=require('uuid');
const { S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand, S3} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const studentFileModel = require('../models/student-file-model');
const studentModel = require('../models/student-model');
const studentTrainingModel = require('../models/student-training-model');

class HomeworkController{

  async  fileUpload(req, res, next) {
    const S3 = new S3Client({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
      region: 'eu-central-1'
    });
  
    try {
      const uploadedFile = req.files.file;
      const fileName = uuid.v4();
      const { name, description, subject ,teacher} = req.body;
     
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileName,
        Body: uploadedFile.data,
        ContentType: uploadedFile.mimetype
      };
      const command = new PutObjectCommand(params);
  
      await S3.send(command);
  
      await File.create({ 
        name,
        bucket: process.env.BUCKET_NAME,
        url: fileName,
        description,
        course: subject,
        teacher 
      });
  
      res.json(uploadedFile);
    } catch (e) {
      next(e);
    }
  }
    async getHomework(req, res, next) {
      const S3 = new S3Client({
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: 'eu-central-1'
      });
    
      try {
        const {teacher}=req.cookies;
        const homework = await File.find({teacher});
        const homeworkWithUrls = [];
    
        for (const item of homework) {
          const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: item.url
          };
    
          const command = new GetObjectCommand(getObjectParams);
          const url = await getSignedUrl(S3, command, { expiresIn: 6200 });
    
          const itemWithUrl = {
            ...item.toObject(),
            url: url
          };
          homeworkWithUrls.push(itemWithUrl);
        }
    
        return res.json(homeworkWithUrls);
      } catch (e) {
        next(e);
      }
    }
    
    async deleteHomework(req, res, next) {
      const s3Client = new S3Client({
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: 'eu-central-1'
      });
    
      try {
        const {_id} = req.body;
        const homework = await File.findOne({ _id });
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: homework.url
        };
    
        const deleteCommand = new DeleteObjectCommand(params);
        await s3Client.send(deleteCommand);
        await File.findOneAndDelete({_id});
        const sent=await StudentFile.find({parentHomework:_id});
        for(const item of sent){

          const params1 = {
            Bucket: process.env.BUCKET_NAME,
            Key: item.url
          };

          const deleteCommand = new DeleteObjectCommand(params1);
          await s3Client.send(deleteCommand);

          await StudentFile.findByIdAndDelete(item._id);
        }
        return res.json({ message: 'Homework deleted successfully' });
      } catch (e) {
        next(e);
      }
    }

    async sendStudentHomework(req,res,next){
      const S3 = new S3Client({
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: 'eu-central-1'
      });
      try{
        const uploadedFile = req.files.file;
        const { login,teacher } = req.cookies;
        const {_id}=req.body;
        const fileName = uuid.v4();
    
        console.log(uploadedFile);

        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: fileName,
          Body: uploadedFile.data,
          ContentType: uploadedFile.mimetype
        };
        const command = new PutObjectCommand(params);
    
        await S3.send(command);
    
        await StudentFile.create({ 
          name:uploadedFile.name,
          bucket: process.env.BUCKET_NAME,
          url: fileName,
          parentHomework:_id,
          student:login,
          teacher 
        });
    
        res.json(uploadedFile);
      }
      catch(e){
        next(e);
      }
    }
    
    async getStudentHomework(req,res,next){
      const S3 = new S3Client({
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: 'eu-central-1'
      });
      try{
        const {login}=req.cookies;
        const homework = await StudentFile.find({student:login});
        const homeworkWithUrls = [];
    
        for (const item of homework) {
          const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: item.url
          };
    
          const command = new GetObjectCommand(getObjectParams);
          const url = await getSignedUrl(S3, command, { expiresIn: 6200 });
    
          const itemWithUrl = {
            ...item.toObject(),
            url: url
          };
          homeworkWithUrls.push(itemWithUrl);
        }
        res.json(homeworkWithUrls);
      }
      catch(e){
        next(e);
      }
    }

    async getById(req,res,next){
      const S3 = new S3Client({
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: 'eu-central-1'
      });
      try{
        const {_id}=req.body;
        const homework = await StudentFile.find({parentHomework:_id});
        const homeworkWithUrls = [];
    
        for (const item of homework) {
          const getObjectParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: item.url
          };
    
          const command = new GetObjectCommand(getObjectParams);
          const url = await getSignedUrl(S3, command, { expiresIn: 6200 });
    
          const itemWithUrl = {
            ...item.toObject(),
            url: url
          };
          homeworkWithUrls.push(itemWithUrl);
        }
        res.json(homeworkWithUrls);
      }
      catch(e){
        next(e);
      }
    }

    async teacherHomeworkDelete(req,res,next){
      try{
        const s3Client = new S3Client({
          credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
          },
          region: 'eu-central-1'
        });
        
        const {_id} = req.body;
        const homework = await StudentFile.findOne({ _id });
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: homework.url
        };
    
        const deleteCommand = new DeleteObjectCommand(params);
        await s3Client.send(deleteCommand);
        await StudentFile.findOneAndDelete({_id});
        return res.json({ message: 'Homework deleted successfully' });

      }
      catch(e){
        next(e);
      }
    }

    async getStudentsHomework(req,res,next){
      try{
        const {login}=req.cookies;
        const homeworks=await StudentFile.find({student:login});
        res.json(homeworks);
      }
      catch(e){
        next(e);
      }
    }
}


module.exports=new HomeworkController;