let connect = require('../mongodb/connect');
let Schema = connect.Schema;
let ObjectId = Schema.Types.ObjectId;

let CommentSchema = new Schema({
    content  : { type: String, required: true },
    create_at: { type: String, required: true },
    author   : { type: ObjectId, ref: 'User', required: true },
    reply_to : { type: ObjectId }, // 是否是回复某一条评论的
    reply_who: { type: ObjectId, ref: 'User' },
    blog_id  : { type: String,   required: true },
    up       : { type: Number,   default: 0 },
    ups      : [{ 
        type: ObjectId,
        ref: 'User'
    }],
    deleted  : { type: Boolean,  default: false }
});

let Comment = connect.model('Comment', CommentSchema);

// 新评论
exports.comment = function (initials) {
    var c = new Comment();
    c = Object.assign(c, initials);
    c.create_at = new Date().getTime();

    return c.save();
};

// 按博客id来搜索评论列表
exports.findByBlogId = function (id, offset = 0, limit = 10000) {
    return Comment.find({ blog_id: id, deleted: false })
            .skip(offset)
            .limit(limit)
            .populate('author', 'username avatar_url')
            .populate('ups', 'username avatar_url')
            .populate('reply_who', 'username')
            .exec();
};

// 根据评论ID删除
exports.delete = function (id) {
    return Comment.findOneAndUpdate({_id: id, deleted: false}, {deleted: true}).exec();
};

// 按评论ID查找
exports.findById = function(id) {
    return Comment.findOne({_id: id, deleted: false }).exec();
};

// 点赞
exports.up = function (id, user_id) {
    let update = {
        $inc: { up: 1 },
        $push: {
            ups: user_id 
        }
    };
    return Comment.findOneAndUpdate({_id: id, deleted: false}, update).exec();
};

// 取消点赞
exports.down = function (id, user_id) {
    let update = {
        $inc: {up: -1},
        $pull: {
            ups: user_id
        }
    };

    return Comment.findOneAndUpdate({_id: id, deleted: false}, update).exec();
};