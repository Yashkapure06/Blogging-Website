// blog routes
const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const multer = require('multer');

// Lets define Storage for storing the uploaded images 

const storage = multer.diskStorage({
    // to locate destination of a file which is being uploaded
    destination: function(res, file, callback){
        callback(null,'/public/uploads');
    },

    // add back the extension to the file name
    filename: function(res, file, callback){
        callback(null, Date.now() + file.originalname);
    },

})

// upload parameters for multer for uploading images
// const upload = multer({
//     storage: storage,
//     limits:{
//         fileSize: 1024* 1024* 3,
//     },
// })