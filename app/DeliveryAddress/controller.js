const { subject } = require('@casl/ability');
const { policyFor } = require('../../utils');
const DeliveryAddress = require('./model');

const addDeliveryAddress = async (req, res, next) => {
    try {
        let payload = req.body;
        let user = req.user;
        let deliveryAddress = new DeliveryAddress({ ...payload, user: user._id });
        await deliveryAddress.save();
        return res.status(200).json({
            message: 'Alamat pengiriman berhasil ditambahkan',
            deliveryAddress
        });
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 500,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

const editDeliveryAddressById = async (req, res, next) => {
    try {
        let { _id, ...payload } = req.body;
        let { id } = req.params;
        let policy = policyFor(req.user);
        let address = await DeliveryAddress.findById(id);
        let subjectAddress = subject('DeliveryAddress', { ...address, user_id: address.user });
        if (!policy.can('update', subjectAddress)) {
            return res.status(403).json({
                message: 'Anda tidak memiliki hak akses!'
            });
        }

        address = await DeliveryAddress.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });
        return res.status(201).json(address);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 500,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

const deleteDeliveryAddressById = async (req, res, next) => {
    try {
        let { id } = req.params;
        let policy = policyFor(req.user);
        let address = await DeliveryAddress.findById(id);
        let subjectAddress = subject('DeliveryAddress', { ...address, user_id: address.user });
        if (!policy.can('delete', subjectAddress)) {
            return res.status(403).json({
                message: 'Anda tidak memiliki hak akses!'
            });
        }

        address = await DeliveryAddress.findByIdAndDelete(id);
        return res.status(201).json({
            message: 'Alamat pengiriman berhasil dihapus'
        });
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 500,
                message: err.message,
                fields: err.errors
            });
        }
        next(err);
    }
}

const getAllDeliveryAddress = async (req, res, next) => {
    try {
        let { skip = 0, limit = 10 } = req.query;
        let address =
            await DeliveryAddress
                .find({ user: req.user._id })
                .skip(parseInt(skip))
                .limit(parseInt(limit))
                .sort('-createdAt');

        let count = await DeliveryAddress.find({ user: req.user._id }).countDocuments();
        return res.json({
            data: address,
            count
        });
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 500,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

module.exports = {
    addDeliveryAddress,
    editDeliveryAddressById,
    deleteDeliveryAddressById,
    getAllDeliveryAddress,
}
