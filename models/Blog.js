const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
//slug is a plugin that is used to generate a slug for a given string
const domPurify = require('dompurify');
//dompurify is a plugin that is used to sanitize the html
const {JSDOM} = require('jsdom');
//JSDOM is a plugin that is used to parse the html
const htmlPurify= domPurify(new JSDOM().window);
//htmlPurify is a plugin that is used to sanitize the html

const stripHtml = require('string-strip-html');
//stripHtml is a function that strips html tags from a string

// Lets initialize Slug
mongoose.plugin(slug);
//mongoose.plugin is a method that is used to add a plugin to a model.

// Lets create a new schema
const blogSchema = new mongoose.Schema({
    //mongoose.Schema is used to create a new schema
    title: {
        type: String,
        required: true,
    },
    metaDescription:{
        type: String,
    },
    author:{
        type: String,
        required: true,
    },
    twitter:{
        type: String,
        required: true,
    },
    instagram:{
        type: String,
        required: true,
    },
    website:{
        type: String,
    },
    aboutAuthor:{
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    timeCreated: {
        //timeCreated is a virtual field
        type: Date,
        default: () => Date.now(),
    },
    snippet:{
        //snippet is the first part of the blog post
        type: String,
    },
    img:{
        type: String,
    },
    slug: {
        type: String,
        slug: 'title',
        //slug means the slug will be generated from the title
        unique: true,
        //unique means that the slug will be unique for each blog
        slug_padding_size:2
        //slug_padding_size means the number of digits to be added to the slug
    },
    likeCount: {
        type: Array,
    }
});

blogSchema.pre('validate', function (next) {
    // check if there is a description.
    if(this.description){
        // if there is a description, lets strip html tags and then trim the string
            
        this.description = htmlPurify.sanitize(this.description);
        this.snippet = stripHtml(this.description.substring(0, 200)).result;
  }

    next();
})

module.exports = mongoose.model('Blog', blogSchema);