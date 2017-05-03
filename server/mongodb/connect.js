let mongoose = require('mongoose');

let url = 'mongodb://localhost:27017/blog';

mongoose.connect(url, {
    server: {
        auto_reconnect: true,
        poolSize: 20
    }
}, function(err) {
    if (err) {
        console.error(err.stack);
    }
});

mongoose.Promise = global.Promise;

module.exports = mongoose;
