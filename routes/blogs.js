// blog routes
const express = require('express');
const Blog = require('../models/Blog');
const router = express.Router();
const multer = require('multer');


// const  likePost =require('../controllers/posts.js');
// Blog.findOneAndUpdate({_id :id}, {$inc : {'blog.likeCount' : 1}}).exec();

// Lets define Storage for storing the uploaded images 

const storage = multer.diskStorage({
    // to locate destination of a file which is being uploaded
    destination: function(res, file, callback){
        callback(null,'./public/uploads/images');
    },

    // add back the extension to the file name
    filename: function(res, file, callback){
        callback(null, Date.now() + file.originalname);
    },

})

// upload parameters for multer for uploading images
const upload = multer({
    // multer will only accept files with these extensions
    storage: storage,
    limits:{
        fileSize: 1024* 1024* 3,
    },
})



router.get('/new', (req, res)=>{
    res.render('new');
})

//like
// add a document to the DB collection recording the click event

// router.put("/:id/like",async (req,res)=>{

//     try{
//         const blog = await Blog.findById(req.params.id);
//         blog.likeCount += 1;
//         await blog.save();
//         console.log(blog.likeCount);
//         res.send({likeCount: blog.likeCount}+" Likes");

//     }catch(err){
//         res.status(500).json(err);
//     }
// })

//  view route 
router.get('/:slug', async (req, res)=>{
    let blog = await Blog.findOne({ slug: req.params.slug });
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
    //post() => this method is used to send data to the server.
    // single() => this method is used to upload a single file.
    // req.file is the file that is being uploaded
    // req.body is the data that is being sent to the server
    // console.log(req.file);
    // console.log(req.body);
    let blog = new Blog({
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        img: req.file.filename,
        aboutAuthor: req.body.aboutAuthor,
        twitter: req.body.twitter,
        instagram: req.body.instagram,
        website: req.body.website,
        metaDescription: req.body.metaDescription,
        likeCount: req.body.likeCount,
        tags: req.body.tags,
        metaKeywords: req.body.metaKeywords,
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
// route that will handle edit view
router.get('/edit/:id', async(req, res) => {
    //get() => this method is used to find a single document by its id.
    //async keyword is used to wait for the promise to be resolved
    let blog = await Blog.findById(req.params.id);
    // findById() => this method finds and returns the first document that matches the query criteria.
    res.render('edit',{blog:blog});
    // render the edit view 
});


// route that will handle update
router.put('/:id', async(req, res)=>{
    // put() => this method is used to update a document in the collection.
    req.blog = await Blog.findById(req.params.id);
    // params is used for getting the id of the blog that is being edited


    // req.blog = await Blog.findOneAndUpdate({_id:req.params.id}, {$inc: {Blog: req.likeCount: 1}}).exec();


    let blog = req.blog;                    

    // const updatedPost = await Blog.findByIdAndUpdate(id, { likeCount: req.params.likeCount + 1 }, { new: true });
    // blog is the blog that is being edited
    blog.title = req.body.title;
    blog.author = req.body.author;
    blog.description = req.body.description;
    try{
        blog = await blog.save();
        //now redirect to the view route
        res.redirect(`/blogs/${blog.slug}`);
    }catch(err){
        console.log(err);
        res.redirect(`/blogs/edit/${blog.id}`, {blog:blog});
        // redirect to the edit route
    }
})

// router.patch('/:id/likePost', likePost);


// route that will handle delete
router.delete('/:id', async(req, res)=>{
    // delete() => this method is used to delete a document from the collection.
    await Blog.findByIdAndDelete(req.params.id);
    // findByIdAndDelete() => this method is used to delete a document from the collection.
    res.redirect('/');
})


module.exports = router;