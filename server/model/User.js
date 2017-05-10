let connect = require('../mongodb/connect');
let Schema = connect.Schema;

// Schema 一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
let UserSchema = new Schema({
    username   : { type: String },
    password   : { type: String },
    avatar_url : { type: String },
    gender     : { type: String },
    email      : { type: String },
    mobile     : { type: String },
    introduce  : { type: String }    
});

// model 由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
let User = connect.model('User', UserSchema);

// 注册
exports.register = function (username, password) {
    // Entity 由Model创建的实体，他的操作也会影响数据库
    let user = new User();
    user.username = username;
    user.password = password;
    //Model#save方法返回一个promise对象
    return user.save();
};

// 根据用户名查找用户
// 加上lean() 返回普通对象
exports.findByUsername = function (username) {
    return User.findOne({username: username}).lean().exec();
}

// 根据用户名更新用户信息
exports.updateByUsername = function(username, update) {
    return User.findOneAndUpdate({username: username}, update).lean().exec();
}