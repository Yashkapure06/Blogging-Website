const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const domPurify = require('dompurify');
const {JSDOM} = require('jsdom');
const htmlPurify= domPurify(new JSDOM().window);

const stripHtml = require('string-strip-html');

// Lets initialize Slug
mongoose.plugin(slug);

// Lets create a new schema
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    timeCreated: {
        type: Date,
        default: () => Date.now(),
    },
    snippet:{
        type: String,
    },
    img:{
        type: String,
    },
    slug: {
        type: String,
        slug: 'title',
        unique: true,
        slug_padding_size:2
    },
});

blogSchema.pre('validate', function (next) {
    // check if there is a description.
    if(this.description){
        // if there is a description, lets strip html tags and then trim the string
        this.snippet = stripHtml(htmlPurify.sanitize(this.description)).substring(0,200).result;
    }

    next();
})

module.exports = mongoose.model('Blog', blogSchema);