const Training=require('../models/training-file-model')
const uuid=require('uuid');
const { S3Client,PutObjectCommand,GetObjectCommand,DeleteObjectCommand, S3} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const StudentTraining=require('../models/student-training-model');

class TrainingController{
    async uploadFile(req,res,next){
        const S3 = new S3Client({
            credentials: {
              accessKeyId: process.env.ACCESS_KEY,
              secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
            region: 'eu-central-1'
        });
        try{
            const uploadedFile = req.files.file;
            const { teacher} = req.cookies;
            const fileName = uuid.v4();
            const { name, description, course} = req.body;

            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: fileName,
                Body: uploadedFile.data,
                ContentType: uploadedFile.mimetype
            };

            const command = new PutObjectCommand(params);
  
            await S3.send(command);

            await Training.create({ 
                name,
                bucket: process.env.BUCKET_NAME,
                url: fileName,
                description,
                course: course,
                teacher:teacher,
                type:'training' 
              });
              res.json(uploadedFile);
        }
        catch(e){
         next(e);
        }
    }

    async getTrainings(req,res,next){
        const S3 = new S3Client({
            credentials: {
              accessKeyId: process.env.ACCESS_KEY,
              secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
            region: 'eu-central-1'
        });

        try{
         const {teacher}=req.cookies;
         const homework = await Training.find({teacher,type:'training'});
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
        }
        catch(e){
            next(e);
        }
    }

    async deleteTraining(req,res,next){
      const s3Client = new S3Client({
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: 'eu-central-1'
      });
        try {
          const { _id } = req.body;
          const homework = await Training.findOne({ _id });
      
          if (!homework) {
            return res.status(404).json({ message: 'Training not found' });
          }
          

          const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: homework.url
          };
      
          const deleteCommand = new DeleteObjectCommand(params);
          await s3Client.send(deleteCommand);
          await Training.findByIdAndDelete(_id);
          const sent=await StudentTraining.find({parentTraining:_id});
          for(const i of sent){

            const params1 = {
              Bucket: process.env.BUCKET_NAME,
              Key: i.url
            };

            const deleteCommand = new DeleteObjectCommand(params1);
            await s3Client.send(deleteCommand);

            await StudentTraining.findByIdAndDelete(i._id);
          }
          return res.json({ message: 'Training deleted successfully' });
        } catch (e) {
          console.error(e);
          next(e);
        }
    }

    async studentUploadFile(req,res,next){
      const S3 = new S3Client({
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: 'eu-central-1'
    });
      try{
        const uploadedFile = req.files.file;
            const { teacher,login } = req.cookies;
            const fileName = uuid.v4();
            const {_id} = req.body;

            const params = {
                Bucket: process.env.BUCKET_NAME,
                Key: fileName,
                Body: uploadedFile.data,
                ContentType: uploadedFile.mimetype
            };

            const command = new PutObjectCommand(params);
  
            await S3.send(command);

            await StudentTraining.create({ 
                name:uploadedFile.name,
                bucket: process.env.BUCKET_NAME,
                url: fileName,
                parentTraining:_id,
                teacher:teacher,
                student:login,
                type:'training' 
              });
              res.json(uploadedFile);
      }
      catch(e){
        next(e);
      }
    }

    async getStudentTrainings(req,res,next){
      const S3 = new S3Client({
          credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
          },
          region: 'eu-central-1'
      });

      try{
       const {login}=req.cookies;
       const homework = await StudentTraining.find({student:login});
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
      }
      catch(e){
          next(e);
      }
  }

  async deleteStudentTraining(req,res,next){
    const s3Client = new S3Client({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
      region: 'eu-central-1'
    });
      try {
        const { _id } = req.body;
        const homework = await StudentTraining.findOne({ _id });
    
        if (!homework) {
          return res.status(404).json({ message: 'Training not found' });
        }
    
        const params = {
          Bucket: process.env.BUCKET_NAME,
          Key: homework.url
        };
    
        const deleteCommand = new DeleteObjectCommand(params);
        await s3Client.send(deleteCommand);
        await StudentTraining.findOneAndDelete({ _id });
    
        return res.json({ message: 'Training deleted successfully' });
      } catch (e) {
        console.error(e);
        next(e);
      }
  }

  async getSentStudentTrainings(req,res,next){
    const S3 = new S3Client({
        credentials: {
          accessKeyId: process.env.ACCESS_KEY,
          secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: 'eu-central-1'
    });

    try{
     const {_id}=req.body;
     const homework = await StudentTraining.find({parentTraining:_id});
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
    }
    catch(e){
        next(e);
    }
}

async getStudentTrainingsTeacher(req,res,next){
  const S3 = new S3Client({
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
      region: 'eu-central-1'
  });

  try{
   const {teacher}=req.cookies;
   const homework = await Training.find({teacher});
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
  }
  catch(e){
      next(e);
  }
}
   
}

module.exports=new TrainingController();