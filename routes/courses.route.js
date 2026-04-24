const express = require('express');

const {body} = require('express-validator');

const router = express.Router();

const courseController = require('../controllers/courses.controller');

const { validationSchema } = require('../middlewares/validationSchema');

const verifyToken = require('../middlewares/verifyToken');
const allowedTo = require('../middlewares/allowedTo');
const userRoles = require('../utils/userRoles');


router.route('/')
    .get(courseController.getAllCourse)
    .post(verifyToken, allowedTo(userRoles.MANGER), validationSchema(), courseController.addCourse);

router.route('/:courseId')
    .get(courseController.getCourse)
    .patch(courseController.updateCourse)
    .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), courseController.deleteCourse);

module.exports = router;