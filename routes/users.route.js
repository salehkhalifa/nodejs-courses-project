const express = require('express');

const appError = require('../utils/appError');

const router = express.Router();

const multer = require('multer');
// const upload = multer({ dest: 'uploads/'});

const diskStorage = multer.diskStorage({ // diskStorage بتخلينى احفظ الملف فى disk
    destination: function (req, file, cb) { // بتدد مكان تخزين الصورة
        console.log("FILE", file);
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) { //filename to edit file name && cb --> call back
        const ext = file.mimetype.split('/')[1]; // to add extension to saved image
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const imageType = file.mimetype.split('/')[0];

    if(imageType == 'image') {
        return cb(null, true);
    } else {
        return cb(appError.create('file must be image', 400), false);
    }
}

const upload = multer({ storage: diskStorage, 
    fileFilter}); // <-- fileFilter: fileFilter

const usersController = require('../controllers/users.controller');
const verifyToken = require('../middlewares/verifyToken');

router.route('/')
    .get(verifyToken, usersController.getAllUsers);

router.route('/register')
    .post(upload.single('avatar'), usersController.register);

router.route('/login')
    .post(usersController.login);

module.exports = router;