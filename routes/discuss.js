const Router = require('koa-router');
const discuss = new Router();
const { queryDiscuss, createDiscuss } = require('../spider/discuss');

discuss.get('/:id', async (ctx, next) => {
    const id = ctx.params.id
    const data = await queryDiscuss(id);
    ctx.body = data;
    next();
})

discuss.post('/', async (ctx, next) => {
    const {name, text, time, roomId} = ctx.request.body;
    await createDiscuss(name, text, time, roomId);
    ctx.body = '添加成功';
})

module.exports = discuss;