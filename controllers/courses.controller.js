const Course = require('../models/course.model');

const httpStatusText = require('../utils/httpStatusText');

const asyncWrapper = require('../middlewares/asyncWrapper');

const {body, validationResult} = require('express-validator');

const appError = require('../utils/appError');

const getAllCourse = asyncWrapper(
    async (req, res) => {
        const query = req.query;
        console.log(req.query);

        const limit =  query.limit || 4;
        const page = query.page || 1;
        const skip = (page - 1) * limit;

        const courses = await Course.find({}, {"__v": false}).limit(limit).skip(skip);

        res.json({status: httpStatusText.SUCCESS, data: {courses}});
    }
)
const getCourse = asyncWrapper(
    async (req, res, next) => {
        const course = await Course.findById(req.params.courseId);
        if(!course) {
            const error = appError.create('not found course', 404, httpStatusText.FAIL);
            return next(error);
        }
        res.json({status: httpStatusText.SUCCESS, data: {course}});
        
    }
)

const addCourse = asyncWrapper(async (req, res, next) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
        return next(error);
    }

    const newCourse = new Course(req.body);
    await newCourse.save();
    
    res.status(201).json({status: httpStatusText.SUCCESS, data: {course: newCourse}});
})

const updateCourse = asyncWrapper(async (req, res) => {
    const courseId = req.params.courseId;
    const updatedCourse = await Course.updateOne({_id: courseId}, {$set: { ...req.body}});
    return res.status(201).json({status: httpStatusText.SUCCESS, data: {course: updatedCourse}});
    
    
})

const deleteCourse = asyncWrapper(async (req, res) => {
    await Course.deleteOne({_id: req.params.courseId});

    res.status(200).json({status: httpStatusText.SUCCESS, data: null});
})

module.exports = {
    getAllCourse,
    getCourse,
    addCourse,
    updateCourse,
    deleteCourse
}