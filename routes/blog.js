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
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 1024* 1024* 3,
    },
})

router.get('/new', (req, res)=>{
    res.render('new');
})


//  view route 
router.get('/:slug', async (res, req)=>{
    const blog = await Blog.findOne({slug: req.params.slug})
    // the await keyword is used to wait for the promise to be resolved
    
    // findOne() => this method finds and returns the first document that matches the query criteria.
    if(blog){
        res.render('show', {blog:blog});
    } else{
        res.redirect('/');
    }
})

// Routes that handles new posts 
router.post('/', upload.single('image'), async(req, res)=>{
    // single() => this method is used to upload a single file.
    // req.file is the file that is being uploaded
    // req.body is the data that is being sent to the server
    // console.log(req.file);
    // console.log(req.body);
    const blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        img: req.file.filename,
    });

    try{
        blog = await blog.save();
        // await means that the code will wait for the promise to be resolved
        res.redirect(`blogs/${blog.slug}`);
        // redirect to the show page
        
    }catch(err){
        console.log(err);
    }
});

