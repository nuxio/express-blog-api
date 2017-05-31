let connect = require('../mongodb/connect');
let Schema = connect.Schema;

/**
 * author 字段的type 可以是ObjectId / Number / String / Buffer
 */
let BlogSchema = new Schema({
    title         : { type: String },
    content       : { type: String },
    tags          : { type: Array  },
    author        : { type: Schema.Types.ObjectId, ref: 'User' },
    create_at     : { type: String },
    last_modify_at: { type: String,  default: ''    },
    visit         : { type: Number,  default: 0     },
    up            : { type: Number,  default: 0     },
    ups           : [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User'
    }],
    deleted       : { type: Boolean, default: false }
});

let Blog = connect.model('Blog', BlogSchema);

// 发布博客
exports.create = function(initials) {
    let blog = new Blog();
    blog = Object.assign(blog, initials);

    blog.create_at = new Date().getTime();
    return blog.save();
};

// 根据_id查找博客（有增加浏览量）
exports.findById = function(id) {
    return Blog.findOneAndUpdate({_id: id, deleted: false}, {$inc: { visit: 1 }})
                .populate('author', 'username avatar_url')
                .populate('ups', 'username avatar_url')
                .exec();
};

// 根据_id查找博客
exports.findByIdWithoutVisitInc = function(id) {
    return Blog.findOne({_id: id, deleted: false}).exec();
};

// 根据_id更新博客
exports.updateById = function(id, update) {
    update.last_modify_at = new Date().getTime();
    return Blog.findByIdAndUpdate(id, update).exec();
};

// 计算总共有多少条
exports.count = function() {
    return Blog.count({deleted: false});
}

/**
 * 分页查找
 * @params {Object} filters 其他查询参数，如 { author: 'xxx' }
 */
exports.findByPage = function(offset, limit, filters = {}) {
    filters.deleted = false;
    return Blog.find(filters, {content: 0, deleted: 0, ups: 0, __v: 0})
                .skip(offset)
                .limit(limit)
                .populate('author', 'username avatar_url')
                .populate('ups', 'username avatar_url')
                .exec();
};

// 删除博客，标记
exports.deleteById = function(id) {
    return Blog.findByIdAndUpdate(id, {deleted: true}).exec();
};

// 点赞
exports.up = function(id, user_id) {
    let update = {
        $inc: { up: 1 },
        $push: {
            ups: user_id
        }
    };
    return Blog.findOneAndUpdate({_id: id, deleted: false}, update).exec();
};

// 取消点赞
exports.down = function(id, user_id) {
    let update = {
        $inc: { up: -1 },
        $pull: {
            ups: user_id
        }
    };

    return Blog.findOneAndUpdate({_id: id, deleted: false}, update).exec();
};