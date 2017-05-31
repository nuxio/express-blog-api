let fs = require('fs');
let path = require('path');
let formidable = require('formidable');
let config = require('../config');

const regex = /.*\.(jpg|jpeg|png|gif)$/;

function mkdirsSync(dirpath) { 
    if (!fs.existsSync(dirpath)) {
        let pathtmp = '/';
        dirpath.split(path.sep).forEach(function(dirname) {
            if(!dirname) return;
            pathtmp = path.join(pathtmp, dirname);
            if(!fs.existsSync(pathtmp)) {
                try {
                    fs.mkdirSync(pathtmp);
                } catch (err) {
                    console.log(err);
                }
            }
        });
    }
    return true; 
}

/**
 * 上传图片方法
 * @param {String} folder 上传到哪个目录
 * @param {String} filename 保存时的文件名 
 * @param {String} fieldname 上传的文件在表单中的名称
 */
exports.uploadImg = function (req, res, folder, filename, fieldname) {
    let new_path = '';
    let form = new formidable.IncomingForm();
    let dest = path.resolve(__dirname, config.upload_path + folder);
    if(!fs.existsSync(dest)) {
        mkdirsSync(dest);
    }
    form.uploadDir = dest;
    form.type = true;
    form.keepExtensions = true;
    form.maxFieldsSize = 500 * 1024;

    form.parse(req, function (err, fields, files) {
        if(err) {
            return res.json({msg: err.message, err});
        }
        if(!regex.test(files[fieldname].name)) {
            return res.json({msg: '只能上传图片'});
        }

        let format = files[fieldname].name.split('.');
        format = format[format.length - 1]; 
        new_path = form.uploadDir + '/' + filename + '.' + format;
        fs.renameSync(files[fieldname].path, new_path);
        
        return res.json({msg: 'ok', url: config.public_path + folder + '/' + filename + '.' + format});
    });
}