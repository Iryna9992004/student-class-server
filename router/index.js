const Router=require('express').Router;
const userController =require('../controllers/user-controller');
const router=new Router();
const {body}=require('express-validator');
const authMiddleware=require('../middlewares/auth-middleware');
const sheduleController=require('../controllers/shedule-controller');
const studentController=require('../controllers/student-controller');
const homeworkController = require('../controllers/homework-controller');
const deleteController = require('../controllers/delete-controller');
const trainingController = require('../controllers/training-controller');
const studentUserController=require('../controllers/student-user-controller');
const gradeController = require('../controllers/grade-controller');

router.post('/registration',
 body('email').isEmail(),
 body('password').isLength({min:8, max:55}),
 userController.registration);
 
router.post('/login',userController.login);
router.post('/logout',userController.logout);
router.get('/activate/:link',userController.activate);
router.get('/refresh',userController.refresh);
router.get('/users',authMiddleware,userController.getUsers);

router.post('/add_course',authMiddleware, userController.addCourse);
router.get('/courses',authMiddleware,userController.findCourses);
router.put('/edit_course',authMiddleware,userController.editCourse);
router.post('/delete_course',authMiddleware, userController.deleteCourse);

router.post('/add_shedule',authMiddleware,sheduleController.addShedule);
router.get('/shedule',sheduleController.sheduleList);
router.put('/edit_shedule',authMiddleware,sheduleController.editShedule);
router.post('/delete_shedule',authMiddleware,sheduleController.deleteShedule);

router.post('/add_student',authMiddleware,studentController.addStudent);
router.get('/students',authMiddleware,studentController.studentList);
router.put('/edit_student',authMiddleware,studentController.editStudent);
router.post('/delete_student',authMiddleware,studentController.deleteStudent);

router.post('/upload', authMiddleware,homeworkController.fileUpload);
router.get('/list_homework',homeworkController.getHomework);
router.post('/delete_homework',homeworkController.deleteHomework);

router.delete('/delete_all_shedules',deleteController.deleteShedules);
router.delete('/delete_all_homeworks',deleteController.deleteHomework);
router.delete('/delete_all_students',deleteController.deleteStudents);
router.delete('/delete_all_courses',deleteController.deleteCourses);
router.delete('/delete_all_training',deleteController.deleteTrainings);
router.delete('/delete_my_account',deleteController.deleteAccount);

router.post('/add_training',authMiddleware,trainingController.uploadFile);
router.get('/get_trainings',trainingController.getTrainings);
router.post('/delete_training',trainingController.deleteTraining);

router.post('/student_login',studentUserController.login);
router.post('/student_logout', studentUserController.logout);
router.get('/student_refresh',studentUserController.refresh);

router.post('/student_homework_download',homeworkController.sendStudentHomework);
router.get('/student_homework_list',homeworkController.getStudentHomework);
router.get('/student_training_list',trainingController.getTrainings)

router.post('/student_training_download',trainingController.studentUploadFile);

router.get('/student_works',homeworkController.getStudentHomework);
router.get('/student_trainings',trainingController.getStudentTrainings);

router.post('/get_homework_by_id',homeworkController.getById);
router.post('/get_training_by_id',trainingController.getSentStudentTrainings);

router.post('/add_grade_homework',gradeController.addGradeHomework);
router.post('/add_grade_training',gradeController.addGradeTraining);

router.post('/delete_homework_grade',gradeController.deleteHomeworkGrade);
router.post('/delete_training_grade',gradeController.deleteTrainingGrade);

module.exports=router;