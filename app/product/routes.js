const router = require('express').Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productController = require('./controller');
const { policeCheck } = require('../../middlewares');

router.post(
    '/product',
    upload.single('image'),
    policeCheck('create', 'Product'),
    productController.addProduct
);
router.get(
    '/products',
    productController.getProducts
);
router.get(
    '/product/:id',
    productController.getProductById
);
router.put(
    '/product/:id',
    upload.single('image'),
    policeCheck('update', 'Product'),
    productController.editProductbyId
);
router.delete(
    '/product/:id',
    policeCheck('delete', 'Product'),
    productController.deleteProductById
);

module.exports = router;