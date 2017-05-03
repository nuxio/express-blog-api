let user = require('../controller/user');
let path = require('path');

module.exports = function (app) {
    app.get('/', function(req, res) {
        res.set('Content-Type', 'text/html');
        res.sendFile(path.resolve(__dirname, '../index.html'));
    });

    app.post('/register', user.register);
}