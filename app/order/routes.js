const router = require('express').Router();
const { policeCheck } = require('../../middlewares');

const orderController = require('./controller');

router.post(
    '/order',
    policeCheck('create', 'Order'),
    orderController.addOrder
);
router.get(
    '/orders',
    policeCheck('view', 'Order'),
    orderController.getAllOrder
);

module.exports = router;
