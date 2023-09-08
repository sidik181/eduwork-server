const router = require('express').Router();
const { policeCheck } = require('../../middlewares');
const tagController = require('./controller');
const multer = require('multer');
const upload = multer();

router.post(
    '/tag',
    upload.none(),
    policeCheck('create', 'Tag'),
    tagController.addTag
);
router.get(
    '/tags',
    tagController.getAllTag
);
router.put(
    '/tag/:id',
    policeCheck('update', 'Tag'),
    tagController.editTagById
);
router.delete(
    '/tag/:id',
    policeCheck('delete', 'Tag'),
    tagController.deleteTagById
);

module.exports = router;
