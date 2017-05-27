let express = require('express');
let path    = require('path');
let user    = require('../controller/user');
let blog    = require('../controller/blog');
let comment = require('../controller/comment');
let auth    = require('../util/auth');

let router = express.Router();

// user
router.post('/register',                                   user.register);
router.post('/login',                                      user.login);
router.post('/logout',                                     user.logout);
router.get('/user/:username',                              user.getUserInfoByUsername);
router.post('/user/:username',          auth.confirmLogin, user.updateUserInfo);
router.post('/upload/avatar/:username', auth.confirmLogin, user.uploadAvatar);

// blog
router.post('/create',               auth.confirmLogin, blog.createBlog);
router.post('/blog/delete',          auth.confirmLogin, blog.deleteBlogById);
router.get('/blog/:blog_id',                            blog.findBlogById);
router.post('/blog/:blog_id',        auth.confirmLogin, blog.updateBlogById);
router.get('/blogs',                                    blog.queryBlogsByPage);
router.post('/blog/:blog_id/up',     auth.confirmLogin, blog.up);

// comment
router.post('/:blog_id/comment',       auth.confirmLogin, comment.comment);
router.get('/:blog_id/comments',                          comment.findByBlogId);
router.post('/comment/delete',         auth.confirmLogin, comment.deleteById);
router.post('/comment/:comment_id/up', auth.confirmLogin, comment.up);

module.exports = router;