const Router = require('koa-router');
const room = new Router();
const { queryRoom } = require('../spider/room');

room.get('/', async (ctx, next) => {
    const data = await queryRoom('bozai');
    ctx.body = data;
    next();
})

module.exports = room;