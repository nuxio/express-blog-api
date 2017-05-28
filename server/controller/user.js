let User = require('../model/User');
let crypto = require('crypto');
let UploadUtil = require('../util/upload');
let path_prefix = require('../config').path_prefix;

const password_suffix = '_blog';

// 注册
exports.register = function (req, res) {
    if(req.session.user) {
        return res.json({msg: '您已登录，不能重复注册'});
    }
    let { username, password, password_confirm } = req.body;
    let error_msg = '';
    if(!username) {
        error_msg = '用户名不能为空';
    }
    if(!password) {
        error_msg = '密码不能为空';
    }
    if(!password_confirm) {
        error_msg = '密码确认不能为空';
    }
    if(password !== password_confirm) {
        error_msg = '两次输入都密码不一致';
    }
    if(error_msg) {
        return res.json({msg: error_msg});
    }
    
    let sha256 = crypto.createHash('sha256');
    sha256.update(password + password_suffix);
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

// 登录
exports.login = function (req, res) {
    if(req.session.user) {
        return res.json({msg: '您已登录，不能重复登录'});
    }
    let { username, password, remember } = req.body;
    let error_msg = '';

    if(!username) {
        error_msg = '用户名不能为空';
    }
    if(!password) {
        error_msg = '密码不能为空';
    }
    if(error_msg) {
        return res.json({msg: error_msg});
    }

    let sha256 = crypto.createHash('sha256');
    sha256.update(password + password_suffix);
    password = sha256.digest('hex');

    // 先执行查找
    User.findByUsername(username)
    .then(user => {
        if(!user || user.password !== password) {
            return res.json({msg: '用户名或密码错误'});
        }
        
        // 记住登录，将_id存在cookie中
        if(remember === '1') {
            let opts = {
                path: '/',
                maxAge: 1000 * 3600 * 24 * 7,
                signed: true,
                httpOnly: true
            };
            res.cookie('username', user.username, opts);
        }

        delete user.password;
        req.session.user = user;
        
        res.json({msg: 'ok', user: user});
    })
    .catch(error => {
        res.json({msg: error.message || '用户名或密码错误'});
    });
};

// 退出登录
exports.logout = function (req, res) {
    delete req.session.user;
    res.clearCookie('username');
    res.json({msg: 'ok'});
};

// 根据用户名获取用户详细信息
exports.getUserInfoByUsername = function (req, res) {
    let { username } = req.params;

    if(!username) {
        return res.json({msg: '用户名不能为空'});
    }

    User.findByUsername(username)
    .then(user => {
        delete user.password;
        res.json({msg: 'ok', user: user});
    })
    .catch(error => {
        res.json({msg: '用户不存在'});
    });
};

// 更新用户信息
exports.updateUserInfo = function (req, res) {
    let { username } = req.params;

    if(req.session.user.username !== username) {
        return res.json({msg: '不能修改他人信息'});
    }
    let update = {};

    const can_update_props = ['email', 'gender', 'mobile', 'introduce', 'avatar_url'];

    Object.keys(req.body).forEach(k => {
        if(!update[k] && can_update_props.indexOf(k) > -1) {
            update[k] = req.body[k];
        }
    });

    User.updateByUsername(username, update)
    .then(user => {
        delete user.password;
        res.json({msg: 'ok', user: user});
    })
    .catch(error => {
        res.json({msg: '更新失败', error: error});
    });
};

// 上传用户头像
exports.uploadAvatar = function (req, res) {
    UploadUtil.uploadAvatar(req, res, function (error) {
        if(error) {
            res.json({msg: error.code ? '图片大小超过限制' : error});
        } else {
            let { username } = req.params;
            let originalname = req.file.originalname.split(".");

            let file_path = path_prefix + 'upload/avatars/' + username + '.' + originalname[originalname.length - 1];
            res.json({msg: 'ok', avatar_url: file_path});
        }
    });
};