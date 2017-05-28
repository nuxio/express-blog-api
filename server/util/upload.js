let path = require('path');
let multer = require('multer');
let public_path = require('../config').public_path;

let dest_avatar = public_path ? path.resolve(public_path + '/upload/avatars/') : path.resolve(__dirname, '../public/upload/avatars/');
let dest_blog_img = public_path ? path.resolve(public_path + '/upload/blog_imgs/') : path.resolve(__dirname, '../public/upload/blog_imgs/');

const storage_avatar = multer.diskStorage({
    // 指定上传路径
    destination: dest_avatar,
    // 指定上传文件名
    filename: function (req, file, cb) {
        let { username } = req.params;
        let file_format = file.originalname.split(".");
        cb(null, username + "." + file_format[file_format.length - 1]);
    }
});

// 限制文件上传大小
const limits_avatar = {
    fileSize: 100 * 1024 // 表单中文件总大小限制 bytes
};

const storage_blog_img = multer.diskStorage({
    destination: dest_blog_img,
    filename: function (req, file, cb) {
        let file_format = file.originalname.split(".");
        file_format = file_format[file_format.length - 1];
        let name = 'IMG_' + new Date().getTime() + '.' + file_format;
        cb(null, name);
    }
});

const limits_blog_img = {
    fileSize: 500 * 1024
};

// 校验文件上传格式
const fileFilter = function (req, file, cb) {
    const img_regex = /.*\.(jpg|jpeg|png|gif)$/;
    if(!img_regex.test(file.originalname)) {
        // 第一个参数返回错误对象，亦可返回字符串，第二个参数表示是否保存此文件
        cb('只能上传图片', false);
    } else {
        cb(null, true);
    }
};

exports.uploadAvatar = multer({storage_avatar, limits_avatar, fileFilter}).single('avatar');
exports.uploadBlogImg = multer({storage_blog_img, limits_blog_img, fileFilter}).single('img');