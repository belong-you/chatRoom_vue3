const koa = require('koa');
const http = require('http');
const path = require("path");
const fs = require("fs");
const Router = require('koa-router');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser')
const koaStatic = require('../services/koaStatic');
const app = new koa();
const router = new Router();
const server = http.createServer(app.callback());

app.use(async (ctx, next) => {
    ctx.state.code = 200;
    app.keys = ['password1', 'pwd2'];
    
    const file = await fs.promises.readFile(path.resolve(__dirname, '../public/index.html'), 'utf8')
    ctx.body = file;

    await next();

    const body = ctx.body;
    if (!ctx.originalUrl.includes('api')) return;
    if (ctx.state.code !== 200) {
        ctx.body = {
            code: ctx.state.code,
            msg: body,
        }
    } else {
        ctx.body = {
            code: 200,
            msg: '',
            data: body,
        }
    }
})

app.on('error', err => {  // 监听错误事件
    console.log('error:::::', err);
})
app.use(bodyParser())
app.use(koaStatic(path.resolve(__dirname, '../public')));  // 静态资源
app.use(cors({
    credentials: true,
}));  // 允许跨域


// WebSocket
require('./socket')(server);

// 请求接口
router.use('/api', require('./config').routes());
// router.use('*', (ctx, next) => {
//     ctx.body = 34567890
// });
app.use(router.routes());

server.listen(5008, () => {
    console.log('服务已启动...');
})
