let express = require('express');
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
let session = require('express-session');

let route = require('./route');

let app = express();

// 解析post
app.use(bodyParser.urlencoded({
    extended: true
}));
// cookie
app.use(cookieParser());
// session
app.use(session({
  secret: 'blog',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // secure: true 的话cookie只通过https传递
}))

// 设置路由
route(app);

// 404 handler
app.use(function(req, res, next) {
    res.status(404);
    res.json({msg: '404 not found.'});
});

// 500 handler
app.use(function(req, res, next) {
    res.status(500);
    res.json({msg: '500 server error.'});
});

app.listen(3000, function () {
    console.log('Start listen to port: 3000');
});