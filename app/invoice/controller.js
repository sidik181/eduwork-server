const { subject } = require('@casl/ability');
const { policyFor } = require('../../utils');

const Invoice = require('./model');

const getInvoiceByIdOrder = async (req, res, next) => {
    try {
        let policy = policyFor(req.user);
        let { order_id } = req.params;
        let invoice = await Invoice
            .findOne({ order: order_id })
            .populate('order')
            .populate('user');

        let subjectInvoice = subject('Invoice', { ...invoice, user_id: invoice.user._id });

        if (!policy.can('read', subjectInvoice)) {
            return res.status(403).json({
                message: 'Anda tidak memiliki akses untuk melihat invoice ini.!'
            });
        }


        return res.status(200).json(invoice);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: err.message,
            fields: err.errors
        });
    }
}

const getAllInvoice = async (req, res, next) => {
    try {
        const user = req.user;
        let queryCondition = {};

        if (user.role === 'admin') {
            queryCondition = {};
        } else {
            queryCondition = { user: user._id };
        }

        const invoices = await Invoice.find(queryCondition).populate('order');

        let count = await Invoice.find(queryCondition).countDocuments();

        res.status(200).json({
            data: invoices,
            count
        });
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: err.message,
            fields: err.errors
        });
    }
}

module.exports = {
    getInvoiceByIdOrder,
    getAllInvoice
}