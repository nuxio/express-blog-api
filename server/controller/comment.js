let Comment = require('../model/Comment');

// 按博客加载评论列表
exports.findByBlogId = function (req, res) {
    let { blog_id } = req.params;
    if(!blog_id) {
        return res.json({ msg: '博客ID不能为空'});
    }

    Comment.findByBlogId(blog_id)
    .then(comments => res.json({msg: 'ok', comments}))
    .catch(error => res.json({msg: '获取评论列表失败', error}));
};

// 新增评论
exports.comment = function(req, res) {
    let { content, reply_to } = req.body;
    let { blog_id } = req.params;
    let user = req.session.user;
    if(!content) {
        return res.json({msg: '评论内容不能为空'});
    }
    if(!blog_id) {
        return res.json({msg: '博客ID不能为空'});
    }

    let init = {
        content,
        blog_id,
        author: user._id,
        reply_to: reply_to || null,
        reply_who: null
    };
    if(init.reply_to) {
        Comment.findById(init.reply_to)
        .then(c => {
            if(!c) {
                return res.json({msg: '回复的评论不存在'});
            }
            init.reply_to = c._id;
            init.reply_who = c.author;
            Comment.comment(init)
            .then(c => res.json({msg: 'ok', comment_id: c._id}))
            .catch(error => res.json({msg: '评论失败', error}));
        });
    } else {
        Comment.comment(init)
        .then(c => res.json({msg: 'ok', comment_id: c._id}))
        .catch(error => res.json({msg: '评论失败', error}));
    }
};

// 删除
exports.deleteById = function (req, res) {
    let { comment_id } = req.body;
    let user = req.session.user;
    if(!comment_id) {
        return res.json({msg: '评论ID不能为空'});
    }

    Comment.findById(comment_id)
    .then(comment => {
        return new Promise(function (resolve, reject) {
            if(!comment) {
                reject({msg: '不存在的评论'});
            }
            if(comment.author.toString() !== user._id.toString()) {
                reject({msg: '不能删除他人评论'});
            } else {
                resolve();
            }
        });
    })
    .then(() => Comment.delete(comment_id))
    .then(comment => res.json({msg: 'ok', comment_id: comment._id}))
    .catch(error => res.json({msg: error.msg || '删除评论失败，请稍后再试', error}));
};

// 点赞&取消点赞
exports.up = function (req, res) {
    let { comment_id } = req.params;
    let action = 'up';
    let user = req.session.user;
    let error_msg = '';
    if(!comment_id) {
        error_msg = '评论ID不能为空';
    }
    if(error_msg) {
        return res.json({msg: error_msg});
    }

    Comment.findById(comment_id)
    .then(comment => {
        return new Promise(function (resolve, reject) {
            if(!comment) {
                reject({msg: '不存在的评论'});
            }
            let user_id = user._id.toString();
            if(comment.author.toString() === user_id) {
                reject({msg: '不能为自己的评论点赞'});
            } else {
                if(comment.ups.filter(u => u.toString() === user_id).length) {
                    action = 'down';
                }
                resolve(action);
            }
        })
    })
    .then((action) => {
        if(action === 'up') {
            return Comment.up(comment_id, user._id);
        } else if(action === 'down') {
            return Comment.down(comment_id, user._id);
        } else {
            return res.json({msg: '未知操作'});
        }
    })
    .then(comment => res.json({msg: 'ok', action}))
    .catch(error => res.json({msg: error.msg || '点赞失败，请稍后再试', error}));
};