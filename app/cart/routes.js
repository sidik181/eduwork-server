const router = require('express').Router();
const { policeCheck } = require('../../middlewares');

const cartController = require('./controller');

router.post(
    '/cart',
    policeCheck('add', 'Cart'),
    cartController.addCartItem
);
router.put(
    '/cart/:id',
    policeCheck('update', 'Cart'),
    cartController.updateCartItem
);
router.get(
    '/carts',
    policeCheck('read', 'Cart'),
    cartController.getAllCart
);
router.delete(
    '/cart/:id',
    policeCheck('delete', 'Cart'),
    cartController.deleteCartItem
);

module.exports = router;
