let connect = require('../mongodb/connect');
let Schema = connect.Schema;

let BlogSchema = new Schema({
    title: { type: String },
    content: { type: String },
    tags: { type: Array },
    author: { type: String },
    author_avatar_url: { type: String },
    create_at: { type: String },
    last_modify_at: { type: String },
    removed: { type: Number }
});

let Blog = connect.model('Blog', BlogSchema);

// 发布博客
exports.create = function (initials) {
    let blog = new Blog();
    blog = Object.assign(blog, initials);
    
    blog.create_at = new Date().getTime();
    blog.last_modify_at = '';
    blog.removed = 0;
    return blog.save();
};

// 根据_id查找博客
exports.findById = function(id) {
    return Blog.find({_id: id, removed: 0}).exec();
};

// 根据_id更新博客
exports.updateById = function(id, update) {
    update.last_modify_at = new Date().getTime();
    return Blog.findByIdAndUpdate(id, update).exec();
};

/**
 * 分页查找
 * @params {Object} filters 其他查询参数，如 { author: 'xxx' }
 */
exports.findByPage = function (offset, limit, filters = {}) {
    filters.removed = 0;
    return Blog.find(filters).skip(offset).limit(limit).exec();
};

// 删除博客，标记
exports.deleteById = function (id) {
    return Blog.findByIdAndUpdate(id, {removed: 1}).exec();
}