let Comment = require('../model/Comment');


exports.findByBlogId = function (req, res) {
    let { blog_id } = req.params;
    if(!blog_id.trim()) {
        return res.json({ msg: '博客ID不能为空'});
    }

    Comment.findByBlogId(blog_id)
    .then(comments => res.json({msg: 'ok', comments}))
    .catch(error => res.json({msg: '获取评论列表失败', error}));
};

exports.comment = function(req, res) {
    if(!req.session.user) {
        return res.json({msg: '您还未登录，请先登录'});
    }
    let { content, reply_to } = req.body;
    let { blog_id } = req.params;
    let user = req.session.user;
    if(!content.trim()) {
        return res.json({msg: '评论内容不能为空'});
    }
    if(!blog_id.trim()) {
        return res.json({msg: '博客ID不能为空'});
    }

    let init = {
        content,
        blog_id,
        author: user.username,
        author_avatar_url: user.avatar_url,
        reply_to: reply_to || ''
    };

    Comment.comment(init)
    .then(c => res.json({msg: 'ok', comment_id: c._id}))
    .catch(error => res.json({msg: '评论失败', error}));
};

exports.deleteById = function (req, res) {
    if(!req.session.user) {
        return res.json({msg: '您还未登录，请先登录'});
    }
    let { comment_id } = req.body;
    let user = req.session.user;
    if(!comment_id.trim()) {
        return res.json({msg: '评论ID不能为空'});
    }

    Comment.findById(comment_id)
    .then(comment => {
        return new Promise(function (resolve, reject) {
            if(comment.author !== user.username) {
                reject({msg: '不能删除他人评论'});
            } else {
                resolve();
            }
        });
    })
    .then(() => Comment.delete(comment_id))
    .then(comment => res.json({msg: 'ok', comment_id: comment._id}))
    .catch(error => res.json({msg: error.msg || '删除评论失败，请稍后再试', error}))
}