const router = require('express').Router();
const { policeCheck } = require('../../middlewares');

const invoiceController = require('./controller');

router.get(
    '/invoice/:order_id',
    policeCheck('read', 'Invoice'),
    invoiceController.getInvoiceByIdOrder
)
router.get(
    '/invoices',
    policeCheck('view', 'Invoice'),
    invoiceController.getAllInvoice
)

module.exports = router;
