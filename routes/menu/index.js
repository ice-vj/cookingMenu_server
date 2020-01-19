const router = require('koa-router')();
const menu = require('../../src/controller/menu');
const order = require('../../src/controller/order');

// 类别
router.get('/types', menu.getTypes);

// 菜单
router.get('/menu', menu.getMenu);
router.post('/menu/create', menu.addMenu);
router.delete('/menu/remove', menu.delMenu);
router.put('/menu', menu.editMenu);

// 订单
router.get('/order', order.getOrder);
router.post('/order/create', order.addOrder);
router.delete('/order/remove', order.delOrder);

module.exports = router;