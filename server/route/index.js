let path = require('path');
let user = require('../controller/user');
let blog = require('../controller/blog');

module.exports = function (app) {
    app.get('/', function(req, res) {
        res.set('Content-Type', 'text/html');
        res.sendFile(path.resolve(__dirname, '../index.html'));
    });
    // user
    app.post('/register', user.register);
    app.post('/login', user.login);
    app.get('/user/:username', user.getUserInfoByUsername);
    app.post('/user/:username', user.updateUserInfo);
    app.post('/upload/avatar/:username', user.uploadAvatar);

    // blog
    app.post('/create', blog.createBlog);
    app.get('/blog/:blog_id', blog.findBlogById);
    app.post('/blog/:blog_id', blog.updateBlogById);
    app.get('/blogs/:author', blog.queryBlogsByPage);
    app.post('/blog/delete/:blog_id', blog.deleteBlogById);
};