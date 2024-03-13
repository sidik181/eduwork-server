const router = require('express').Router();
const { policeCheck } = require('../../middlewares');
const categoryController = require('./controller');
const multer = require('multer');
const upload = multer();

router.post(
    '/category',
    upload.none(),
    policeCheck('create', 'Category'),
    categoryController.addCategory
);
router.get(
    '/categories',
    categoryController.getAllCategory
);
router.get(
    '/category/:id',
    categoryController.getCategoryById
);
router.put(
    '/category/:id',
    policeCheck('update', 'Category'),
    categoryController.editCatogoryById
);
router.delete(
    '/category/:id',
    policeCheck('delete', 'Category'),
    categoryController.deleteCategoryById
);

module.exports = router;
