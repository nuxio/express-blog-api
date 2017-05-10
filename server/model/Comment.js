let connect = require('../mongodb/connect');
let Schema = connect.Schema;
let ObjectId = Schema.Types.ObjectId;

let CommentSchema = new Schema({
    content          : { type: String, required: true },
    create_at        : { type: String, required: true },
    author           : { type: String, required: true },
    author_avatar_url: { type: String },
    reply_to         : { type: String }, // 是否是回复某一条评论的
    blog_id          : { type: ObjectId, required: true },
    up               : { type: Number,   default: 0 },
    ups              : { type: Array,    default: [] },
    deleted          : { type: Boolean,  default: false }
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
    return Comment.find({ blog_id: id, deleted: false }).skip(offset).limit(limit).exec();
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
exports.up = function (id, username, avatar_url) {
    let update = {
        $inc: { up: 1 },
        $push: {
            ups: { username, avatar_url }
        }
    };
    return Comment.findOneAndUpdate({_id: id, deleted: false}, update).exec();
};

// 取消点赞
exports.down = function (id, username) {
    let update = {
        $inc: {up: -1},
        $pull: {
            ups: { username }
        }
    };

    return Comment.findOneAndUpdate({_id: id, deleted: false}, update).exec();
};