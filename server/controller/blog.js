let Blog = require('../model/Blog');

exports.createBlog = function (req, res) {
    let { title, content, tags } = req.body;
    let user = req.session.user;
    let error_msg = '';
    if(!user) {
        error_msg = '您还未登录，请登录';
    }
    if(!title.trim()) {
        error_msg = '博客标题不能为空';
    }
    if(!content.trim()) {
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
        author: user.username,
        author_avatar_url: user.avatar_url
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
    if(!blog_id.trim()) {
        return res.json({msg: '博客ID不能为空'});
    }

    Blog.findById(blog_id)
    .then(blog => res.json({msg: 'ok', blog}))
    .catch(error => res.json({msg: '博客不存在', error}))
};

// 根据博客id编辑博客内容
exports.updateBlogById = function (req, res) {
    let { blog_id } = req.params;
    let { title, content, tags } = req.body;
    let user = req.session.user;
    let error_msg = '';
    if(!user) {
        error_msg = '您还未登录，请登录';
    }
    if(!title.trim()) {
        error_msg = '博客标题不能为空';
    }
    if(!content.trim()) {
        error_msg = '博客内容不能为空';
    }
    if(!blog_id.trim()) {
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
            if(blog.author !== user.username) {
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
    .catch(error => res.json({msg: error.msg || '保存失败，请稍后再试', error}))
};

// 分页查找博客
exports.queryBlogsByPage = function (req, res) {
    let { page = 1, limit = 10 } = req.params;
    let query = req.query || {};
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

    Blog.findByPage(page, offset, query)
    .then(blogs => res.json({msg: 'ok', blogs}))
    .catch(error => res.json({msg: '查询失败，请稍后再试', error}));
};

// 删除博客
exports.deleteBlogById = function (req, res) {
    let { blog_id } = req.body;
    if(!blog_id.trim()) {
        return res.json({msg: '博客ID不能为空'});
    }

    Blog.deleteById(id)
    .then(blog => res.json({msg: 'ok', blog_id: blog._id}))
    .catch(error => res.json({msg: '删除失败', error}));
}

exports.up = function (req, res) {
    let { blog_id } = req.params;
    let action = 'up';
    let user = req.session.user;
    let error_msg = '';
    if(!user) {
        error_msg = '您还未登录，请登录';
    }
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
            if(blog.author === user.username) {
                reject({msg: '不能为自己的博客点赞'});
            } else {
                if(blog.ups.filter(u => u.username === user.username).length) {
                    action = 'down';
                }
                resolve(action);
            }
        })
    })
    .then((action) => {
        if(action === 'up') {
            return Blog.up(blog_id, user.username, user.avatar_url);
        } else if(action === 'down') {
            return Blog.down(blog_id, user.username);
        }
    })
    .then(blog => res.json({msg: 'ok', action}))
    .catch(error => res.json({msg: error.msg || '点赞失败，请稍后再试', error}));
}