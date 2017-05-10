let User = require('../model/User');

const NOT_LOGIN = '您还未登录，请先登录';

// 检查用户是否登录
// 如果有cookie则自动登录，保存一下session
exports.confirmLogin = function (req, res, next) {
    if(!req.session.user) {
        let username = req.signedCookies.username;
        if(username) {
            User.findByUsername(username)
            .then(user => {
                if(user) {
                    delete user.password;
                    req.session.user = user;
                    next();
                } else {
                    return res.json({msg: NOT_LOGIN});
                }
            })
            .catch(error => res.json({msg: NOT_LOGIN}));
        } else {
            return res.json({msg: NOT_LOGIN});
        }
    } else {
        next();
    }
}