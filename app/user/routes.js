const router = require('express').Router();

const { policeCheck } = require('../../middlewares');
const userController = require('./controller');

router.post(
    '/user',
    policeCheck('create', 'User'),
    userController.addUser
);
router.get(
    '/users',
    policeCheck('read', 'User'),
    userController.getAllUser
);
router.delete(
    '/user/:id',
    policeCheck('delete', 'User'),
    userController.deleteUserById
);
router.put(
    '/user/:id',
    policeCheck('update', 'User'),
    userController.editUserById
);

module.exports = router;
