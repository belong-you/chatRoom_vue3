const Router = require('koa-router');
const notify = new Router();

notify.get('/', (ctx, next) => {
    ctx.body = 'notify';
})

module.exports = notify;