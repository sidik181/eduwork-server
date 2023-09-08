const router = require('express').Router();
const multer = require('multer');
const os = require('os');

const productController = require('./controller');
const { policeCheck } = require('../../middlewares');

router.post(
    '/product',
    multer({ dest: os.tmpdir() }).single('image'),
    policeCheck('create', 'Product'),
    productController.addProduct
);
router.get(
    '/products',
    productController.getProducts
);
router.put(
    '/product/:id',
    multer({ dest: os.tmpdir() }).single('image'),
    policeCheck('update', 'Product'),
    productController.editProductbyId
);
router.delete(
    '/product/:id',
    policeCheck('delete', 'Product'),
    productController.deleteProductById
);

module.exports = router;