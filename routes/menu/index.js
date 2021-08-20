const router = require('koa-router')();

// const menu = require('../../src/controller/menu');
// const order = require('../../src/controller/order');

const menu2 = require('../../src/controller/menu2');
const order2 = require('../../src/controller/order2');

// // Mongo练习
// //类别
// router.get('/types', menu.getTypes);
// router.post('/types/init', menu.initTypes);

// // 菜单
// router.get('/menu', menu.getMenu);
// router.post('/menu/create', menu.addMenu);
// router.delete('/menu/remove', menu.delMenu);
// router.put('/menu', menu.editMenu);

// // 订单
// router.get('/order', order.getOrder);
// router.post('/order/create', order.addOrder);
// router.delete('/order/remove', order.delOrder);


//mySql练习
// 类别
router.get('/types', menu2.getTypes);
router.post('/types/init', menu2.initTypes);

// 菜单
router.get('/menu', menu2.getMenu);
router.post('/menu/create', menu2.addMenu);
router.delete('/menu/remove', menu2.delMenu);
router.put('/menu', menu2.editMenu);

// 订单
router.get('/order', order2.getOrder);
router.post('/order/create', order2.addOrder);
router.delete('/order/remove', order2.delOrder);

module.exports = router;