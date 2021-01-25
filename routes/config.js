const Router = require('koa-router');
const routes = new Router();

const routerList = [
    { url: '/discuss', route: require('./discuss') },
    { url: '/room', route: require('./room') },
    { url: '/users', route: require('./users') },
    { url: '/notify', route: require('./notify') },
]

routerList.forEach(val => {
    routes.use(val.url, val.route.routes());
})

module.exports = routes;