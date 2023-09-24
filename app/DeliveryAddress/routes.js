const router = require('express').Router();
const { policeCheck } = require('../../middlewares');
const deliveryAddressController = require('./controller');
const multer = require('multer');
const upload = multer();

router.post(
    '/delivery-address',
    upload.none(),
    policeCheck('create', 'DeliveryAddress'),
    deliveryAddressController.addDeliveryAddress
);
router.put(
    '/delivery-address/:id',
    upload.none(),
    policeCheck('update', 'DeliveryAddress'),
    deliveryAddressController.editDeliveryAddressById
);
router.get(
    '/delivery-addresses',
    policeCheck('view', 'DeliveryAddress'),
    deliveryAddressController.getAllDeliveryAddress
);
router.delete(
    '/delivery-address/:id',
    policeCheck('delete', 'DeliveryAddress'),
    deliveryAddressController.deleteDeliveryAddressById
);

module.exports = router;
