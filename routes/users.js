const Router = require('koa-router');
const { user } = require('../spider/power');
const users = new Router();
const { queryUser, createUser } = require('../spider/users');

// 注册接口
users.post('/', async (ctx, next) => {
    const { name, pwd, headImg, time } = ctx.request.body;
    const user = await queryUser(name);
    if (user.length !== 0) {
        // 账号已注册
        ctx.state.code = 202;
        ctx.body = `该 ${name} 账号已被注册！`;  // 202
    } else {
        // 账号未注册
        const arr = [];
        name.split('').forEach(val => {
            arr.push(val.charCodeAt())
        });

        await createUser(name, headImg, pwd, time);
        ctx.cookies.set('user', arr, {signed: true});
        ctx.body = '注册成功！' ;
    }
    next();
})

// 登录接口
users.get('/', async (ctx, next) => {
    const { name, pwd } = ctx.query;
    const user = await queryUser(name);

    if (user.length === 0) {
        // 账号不存在
        ctx.state.code = 404;
        ctx.body = `该 ${name} 用户不存在`;  // 404
    } else {
        if (user[0].name == name && user[0].pwd == pwd) {
            const arr = [];
            name.split('').forEach(val => {
                arr.push(val.charCodeAt())
            });

            ctx.state.code = 200;
            ctx.cookies.set('user', arr, {signed: true});
            ctx.body = '登录成功';
        } else {
            ctx.state.code = 401;
            ctx.body = `用户名或密码错误`;  // 401
        }
    }
    
    next();
})

users.put('/', async (ctx, next) => {
    const user = ctx.cookies.get('user', {signed: true});
    if (!user) {
        // 没有 cookie，或者 cookie 被串改
        ctx.state.code = 404;
        ctx.body = '未检测到有账号登录，或 cookie 已被串改';
    } else {
        ctx.body = user;
    }
})



module.exports = users;