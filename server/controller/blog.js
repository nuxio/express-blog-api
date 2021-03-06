let Blog = require('../model/Blog');
let User = require('../model/User');
let UploadUtil = require('../util/upload');

exports.createBlog = function (req, res) {
    let { title, content, tags } = req.body;
    let user = req.session.user;
    let error_msg = '';
    if(!title) {
        error_msg = '博客标题不能为空';
    }
    if(!content) {
        error_msg = '博客内容不能为空';
    }
    if(error_msg) {
        return res.json({msg: error_msg});
    }

    tags = tags ? (typeof tags === 'string' ? [tags] : typeof tags === 'object' ? tags : [tags.toString()] ) : []; 

    let init = {
        title,
        content,
        tags,
        author: user._id
    };

    Blog.create(init)
    .then(blog => {
        res.json({msg: 'ok', blog_id: blog._id});
    })
    .catch(error => {
        res.json({msg: '发布失败', error});
    });
};

// 根据博客id查找详情
exports.findBlogById = function (req, res) {
    let { blog_id } = req.params;
    if(!blog_id) {
        return res.json({msg: '博客ID不能为空'});
    }

    let result = null;

    Blog.findById(blog_id)
    .then(blog => {
        if(blog) {
            return res.json({msg: 'ok', blog});
        } else {
            return res.json({msg: '没有找到对应内容'});
        }
    })
    .catch(error => res.json({msg: '没有找到对应内容', error}));
};

// 根据博客id编辑博客内容
exports.updateBlogById = function (req, res) {
    let { blog_id } = req.params;
    let { title, content, tags } = req.body;
    let user = req.session.user;
    let error_msg = '';
    if(!title) {
        error_msg = '博客标题不能为空';
    }
    if(!content) {
        error_msg = '博客内容不能为空';
    }
    if(!blog_id) {
        error_msg = '博客ID不能为空';
    }
    if(error_msg) {
        return res.json({msg: error_msg});
    }
    
    tags = tags ? (typeof tags === 'string' ? [tags] : typeof tags === 'object' ? tags : [tags.toString()] ) : []; 

    let update = {
        title,
        content,
        tags
    };

    Blog.findByIdWithoutVisitInc(blog_id)
    .then(blog => {
        return new Promise(function (resolve, reject) {
            if(!blog) {
                reject({msg: '不存在的博客'});
            }
            if(blog.author.toString() !== user._id.toString()) {
                reject({msg: '不能更改他人博客'});
            } else {
                resolve();
            }
        });
    })
    .then(() => {
        return Blog.updateById(blog_id, update);
    })
    .then(blog => res.json({msg: 'ok', blog_id: blog._id}))
    .catch(error => res.json({msg: error.msg || '保存失败，请稍后再试', error}));
};

// 分页查找博客
exports.queryBlogsByPage = function (req, res) {
    let { page = 1, limit = 10 } = req.query;
    let query = req.query || {};
    query.page && (delete query.page);
    query.limit && (delete query.limit);
    
    let error_msg = '';
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if(page <= 0) {
        error_msg = '页数必须是大于零的整数';
    }
    if(limit <= 0) {
        error_msg = '每页条数必须是大于零的整数';
    }
    if(error_msg) {
        return res.json({msg: error_msg});
    }

    let offset = (page - 1) * limit;
    let total_num = 0;
    
    Blog.count()
    .then(count => {
        return new Promise(function (resolve, reject) {
            total_num = count;
            resolve();
        });
    })
    .then(() => Blog.findByPage(offset, limit, query))
    .then(blogs => res.json({msg: 'ok', blogs, total_num, page}))
    .catch(error => res.json({msg: '查询失败，请稍后再试', error}));
};

// 删除博客
exports.deleteBlogById = function (req, res) {
    let { blog_id } = req.body;
    let user = req.session.user;
    if(!blog_id) {
        return res.json({msg: '博客ID不能为空'});
    }

    Blog.findByIdWithoutVisitInc(blog_id)
    .then(blog => {
        return new Promise(function (resolve, reject) {
            if(!blog) {
                reject({msg: '不存在的博客'});
            }
            if(blog.author.toString() !== user._id.toString()) {
                reject({msg: '不能删除他人的博客'});
            } else {
                resolve();
            }
        })
    })
    .then(() => {
        return Blog.deleteById(blog_id);
    })
    .then(blog => res.json({msg: 'ok', blog_id: blog._id}))
    .catch(error => res.json({msg: '删除失败，请稍后再试', error}));
};

exports.up = function (req, res) {
    let { blog_id } = req.params;
    let action = 'up';
    let user = req.session.user;
    let error_msg = '';
    if(!blog_id) {
        error_msg = '博客ID不能为空';
    }
    if(error_msg) {
        return res.json({msg: error_msg});
    }

    Blog.findByIdWithoutVisitInc(blog_id)
    .then(blog => {
        return new Promise(function (resolve, reject) {
            if(!blog) {
                reject({msg: '不存在的博客'});
            }
            let user_id = user._id.toString();
            if(blog.author.toString() === user_id) {
                reject({msg: '不能为自己的博客点赞'});
            } else {
                if(blog.ups.filter(u => u.toString() === user_id).length) {
                    action = 'down';
                }
                resolve(action);
            }
        })
    })
    .then((action) => {
        if(action === 'up') {
            return Blog.up(blog_id, user._id);
        } else if(action === 'down') {
            return Blog.down(blog_id, user._id);
        } else {
            return res.json({msg: '未知操作'});
        }
    })
    .then(blog => res.json({msg: 'ok', action}))
    .catch(error => res.json({msg: error.msg || '点赞失败，请稍后再试', error}));
};

// 上传图片
exports.upload = function (req, res) {
    let filename = 'IMG_' + new Date().getTime();
    UploadUtil.uploadImg(req, res, 'blog_imgs', filename, 'img');
};