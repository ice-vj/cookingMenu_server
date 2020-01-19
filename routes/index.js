const router = require('koa-router')()
const menu = require('./menu');

router.get('/', async (ctx, next) => {
    ctx.body = 'welcome to cooking!'
})

router.use('/cmp_api', menu.routes());

module.exports = router
