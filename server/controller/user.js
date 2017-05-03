let User = require('../model/User');
let crypto = require('crypto');

const password_suffix = '_blog';

// 注册
exports.register = function (req, res) {
    let { username, password, password_confirm } = req.body;
    let error_msg = '';
    if(!username.trim()) {
        error_msg = '用户名不能为空';
    }
    if(!password.trim()) {
        error_msg = '密码不能为空';
    }
    if(!password_confirm.trim()) {
        error_msg = '密码确认不能为空';
    }
    if(password !== password_confirm) {
        error_msg = '两次输入都密码不一致';
    }
    if(error_msg) {
        return res.json({msg: error_msg});
    }
    
    let sha256 = crypto.createHash('sha256');
    sha256.update(password.trim() + password_suffix);
    password = sha256.digest('hex');

    // 先执行查找
    User.findByUsername(username)
    .then(user => {
        return new Promise((resolve, reject) => {
            if(user) {
                reject({message: '用户名已存在，换一个名称吧~'});
            } else {
                resolve();
            }
        });
    })
    .then(() => {
        // 用户名不存在时在进行注册
        return User.register(username, password);
    })
    .then(user => {
        res.json({msg: 'ok', username: user.username});
    })
    .catch(error => {
        res.json({msg: error.message});
    });
}

exports.login = function (req, res) {
    let { username, password, remember } = req.body;
    let error_msg = '';

    if(!username.trim()) {
        error_msg = '用户名不能为空';
    }
    if(!password.trim()) {
        error_msg = '密码不能为空';
    }
    if(error_msg) {
        return res.json({msg: error_msg});
    }

    let sha256 = crypto.createHash('sha256');
    sha256.update(password.trim() + password_suffix);
    password = sha256.digest('hex');

    // 先执行查找
    User.findByUsername(username)
    .then(user => {
        if(user.password !== password) {
            return res.json({msg: '用户名或密码错误'});
        }
        if(remember === 1) {
            
        }
        req.session.user = user;
        res.json({msg: 'ok', username: user.username});
    })
    .catch(error => {
        res.json({msg: '用户名或密码错误'});
    });
}