let path = require('path');
let user = require('../controller/user');
let blog = require('../controller/blog');
let comment = require('../controller/comment');
let auth = require('../util/auth');

module.exports = function (app) {
    app.get('/', function(req, res) {
        res.set('Content-Type', 'text/html');
        res.sendFile(path.resolve(__dirname, '../index.html'));
    });
    // user
    app.post('/register', user.register);
    app.post('/login', user.login);
    app.post('/logout', auth.confirmLogin, user.logout);
    app.get('/user/:username', user.getUserInfoByUsername);
    app.post('/user/:username', auth.confirmLogin, user.updateUserInfo);
    app.post('/upload/avatar/:username', auth.confirmLogin, user.uploadAvatar);

    // blog
    app.post('/create', auth.confirmLogin, blog.createBlog);
    app.get('/blog/:blog_id', blog.findBlogById);
    app.post('/blog/:blog_id', auth.confirmLogin, blog.updateBlogById);
    app.get('/blogs', blog.queryBlogsByPage);
    app.post('/blog/delete/:blog_id', auth.confirmLogin, blog.deleteBlogById);
    app.post('/blog/:blog_id/up', auth.confirmLogin, blog.up);

    // comment
    app.post('/:blog_id/comment', auth.confirmLogin, comment.comment);
    app.get('/:blog_id/comments', comment.findByBlogId);
    app.post('/comment/delete', auth.confirmLogin, comment.deleteById);
    app.post('/comment/:comment_id/up', auth.confirmLogin, comment.up);
};