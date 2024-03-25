const { Types } = require('mongoose');
const Order = require('./model');
const DeliveryAddress = require('../DeliveryAddress/model');
const CartItem = require('../cart-item/model');
const OrderItems = require('../order-item/model');

const addOrder = async (req, res, next) => {
    try {
        let { delivery_fee, delivery_address } = req.body;
        let items = await CartItem.find({ user: req.user._id }).populate('product');
        if (items.length === 0) {
            return res.status(200).json({
                message: 'Anda tidak memiliki order, karena tidak ada barang di keranjang.'
            });
        }
        let address = await DeliveryAddress.findById(delivery_address);
        if (!address) {
            return res.status(404).json({
                message: 'Alamat pengiriman tidak ditemukan.'
            });
        }
        let order = new Order({
            _id: new Types.ObjectId(),
            status: 'waiting_for_payment',
            delivery_fee: delivery_fee,
            delivery_address: {
                provinsi: address.provinsi,
                kabupaten_kota: address.kabupaten_kota,
                kecamatan: address.kecamatan,
                kelurahan: address.kelurahan,
                detail: address.detail,
            },
            user: req.user._id
        });
        let orderItems = await OrderItems
            .insertMany(items.map(item => ({
                ...item,
                name: item.product.name,
                qty: parseInt(item.qty),
                price: parseInt(item.product.price),
                order: order._id,
                product: item.product._id
            })));
        await Promise.all(orderItems.map(async (item) => {
            await item.save();
            order.order_items.push(item);
        }));

        await order.save();
        await CartItem.deleteMany({ user: req.user._id });
        return res.status(200).json(order);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                error: true,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

const getAllOrder = async (req, res, next) => {
    try {
        let { skip = 0, limit = 10 } = req.query;
        let queryCondition = {};

        if (req.user.role === 'admin') {
            queryCondition = {};
        } else {
            queryCondition = { user: req.user._id };
        }

        let orders = await Order
            .find(queryCondition)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('order_items')
            .sort('-createdAt');

        let count = await Order.find(queryCondition).countDocuments();
        return res.status(200).json({
            data: orders.map(order => order.toJSON({ virtuals: true })),
            count
        });
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.status(400).json({
                error: true,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

module.exports = {
    addOrder,
    getAllOrder,
}