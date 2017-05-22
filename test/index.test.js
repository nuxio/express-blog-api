let app = require('../server/index');
let supertest = require('supertest');
let should = require('should');

// 这个不会保存cookie
// let request = supertest(app);
let request = supertest.agent(app);

describe('test/express blog api', function() {
    it('POST /register', function (done) {
        request.post('/register')
               .send({username: 'test', password: 'test', password_confirm: 'test'})
               .expect(200)
               .end(function (err, res) {
                    res.body.msg.should.equal('ok');

                    done(err);
               });
    });

    it('POST /login', function (done) {
        request.post('/login')
               .send({username: 'test', password: 'test', remember: 1})
               .expect(200)
               // 这个好难写，实际的set-cookie头的值是username=xxxxx; 很乱的一串...，而且还有connect.sid这个cookie
            //    .expect('set-cookie', 'cookie=username; Path=/; Max-Age=604800; HttpOnly')
               .end(function (err, res) {
                   res.body.msg.should.equal('ok');
                   res.body.user.should.have.property('username');

                   done(err);
               })
    });

    it('GET /user/:username', function (done) {
        request.get('/user/test')
               .expect(200)
               .end(function (err, res) {
                    res.body.msg.should.equal('ok');
                    res.body.user.should.have.property('username');

                    done(err);
               });
    });

    it('POST /user/:username', function (done) {
        request.post('/user/test')
               .send({email: 'test@xx.com'})
               .expect(200)
               .end(function (err, res) {
                    res.body.msg.should.equal('ok');

                    done(err);
               });
    });

    it('POST /upload/avatar/:username', function (done) {
        request.post('/upload/avatar/test')
               .attach('avatar', './test/files/test_avatar.jpg')
               .expect(200)
               .end(function (err, res) {
                    res.body.msg.should.equal('ok');
                    res.body.avatar_url.should.equal('/public/upload/avatars/test.jpg');

                    done(err);
               });
    });

    it('POST /create', function (done) {
        request.post('/create')
               .send({title: '@Supertest', content: 'Nice Blog.', tags: ['t1', 't2']})
               .expect(200)
               .end(function (err, res) {
                    res.body.msg.should.equal('ok');
                    res.body.should.have.property('blog_id');

                    done(err);
               });
    });

    // 不能传特定的id
    // it('POST /blog/delete', function (done) {
    //     request.post('/blog/delete')
    //            .send({blog_id: "5922b6f0e2b96625bc34afe5"})
    //            .expect(200)
    //            .end(function (err, res) {
    //                 res.body.msg.should.equal('ok');

    //                 done(err);
    //            });
    // });

    // it('GET /blog/:blog_id', function (done) {
    //     request.get('/blog/5922b6f0e2b96625bc34afe5')
    //            .expect(200)
    //            .end(function (err, res) {
    //                 res.body.msg.should.equal('ok');
    //                 res.body.should.have.property('blog');

    //                 done(err);
    //            });
    // });
});