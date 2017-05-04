let path = require('path');
let multer = require('multer');

const storage = multer.diskStorage({
    // 指定上传路径
    // todo: 此处路径以后改为nginx代理的静态目录路径
    destination: path.resolve(__dirname, '../public/upload/avatars/'),
    // 指定上传文件名
    filename: function (req, file, cb) {
        let { username } = req.params;
        let fileFormat = file.originalname.split(".");
        cb(null, username + "." + fileFormat[fileFormat.length - 1]);
    }
});

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

// 限制文件上传大小
const limits = {
    fileSize: 100 * 1024 // 表单中文件总大小限制 bytes
};

exports.upload = multer({storage, limits, fileFilter}).single('avatar');