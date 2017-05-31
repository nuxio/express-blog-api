## API定义  
参数以下划线分隔单词  
返回参数固定格式：  
```javascript
{
    msg: 'ok || error_msg', // 成功返回ok 失败返回错误信息
    ... // 其余参数根据接口自定
}
```

## 注册 POST /register  
```javascript
// request body
{
    username, // 用户名，会做为用户的唯一标识，所以不能重复
    password, 
    password_confirm
}
// response
{
    msg
}
```

## 登录 POST /login  
```javascript
// request body
{
    username,
    password,
    remember // 非必填，1: 是 0: 否
}
// response
{
    msg,
    user: {
        username,
        avatar_url,
        ... // other user info
    }
}
```

## 退出登录 POST /logout
```javascript
// request body
{}
// response
{
    msg
}
```

## 获取用户信息 GET /user/:username
```javascript
// request body
{}
// response
{
    msg,
    user: {
        username,
        avatar_url,
        gender,
        email,
        mobile,
        ... // other user info
    }
}
```

## 修改用户信息 POST /user/:username
```javascript
// request body
// 以下参数均选填，没有表示不修改
{
    email, 
    gender, 
    mobile, 
    introduce, 
    avatar_url
}
// response
{
    msg
}
```

## 上传用户头像 POST /upload/avatar/:username
```javascript
// request body
{
    avatar // file field name, 只支持单文件上传
}
// response
{
    msg,
    url // 头像路径
}
```

## 发布博客 POST /create
```javascript
// request body
{
    title, 
    content, 
    tags // array 标签，非必传
}
// response
{
    msg,
    blog_id // 新增的博客id
}
```

## 删除博客 POST /blog/delete
```javascript
// request body
{
    blog_id
}
// response
{
    msg
}
```

## 获取博客详情 GET /blog/:blog_id
```javascript
// request body
{}
// response
{
    msg,
    blog: {
        _id,
        title,
        content,
        tags, // array
        author: {
            username,
            avatar_url
        },
        author_avatar_url,
        create_at, // timestamp
        last_modify_at, // timestamp
        visit, // 访问量
        up, // 点赞数
        ups: [
            {
                username,
                avatar_url
            }
        ] // array 点赞人数组
    }
}
```

## 修改博客 POST /blog/:blog_id
```javascript
// request body
{
    title, 
    content, 
    tags // array 选填
}
// response
{
    msg
}
```

## 分页查询博客 GET /blogs
```javascript
// querys
{
    page, // 当前页数
    limit // 每页条数
}
// response
{
    msg,
    total_num, // 所有博客的总数
    page, // 当前页数
    blogs: [
        {
            _id,
            title,
            content,
            tags,
            ...
        }
    ]
}
```

## 给博客点赞 POST /blog/:blog_id/up
```javascript
// request body
{}
// response
{
    msg,
    action // 当前点赞的结果 up: 点赞 down: 取消了点赞
}
```

## 添加评论 POST /:blog_id/comment
```javascript
// request body
{
    content,
    reply_to // 回复某条评论的id，选填
}
// response
{
    msg,
    comment_id
}
```

## 获取评论列表 GET /:blog_id/comments
```javascript
// request body
{}
// response
{
    msg,
    comments: [
        {
            content,
            create_at,
            reply_to,
            author: {
                username,
                avatar_url
            },
            up,
            ups: [
                {
                    username,
                    avatar_url
                }
            ]
        }
    ]
}
```

## 删除评论 POST /comment/delete
```javascript
// request body
{}
// response
{
    msg,
    comment_id
}
```

## 给评论点赞 POST /comment/:comment_id/up
```javascript
// request body
{}
// response
{
    msg,
    action // 当前点赞的结果 up: 点赞 down: 取消了点赞
}
```