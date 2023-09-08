const Product = require('../product/model');
const CartItem = require('../cart-item/model');

const addCartItem = async (req, res, next) => {
    try {
        const { items } = req.body;
        const productIds = items.map(item => item.product._id);
        const products = await Product.find({ _id: { $in: productIds } });
        let cartItems = items.map(item => {
            let relatedProduct = products.find(product => product._id.toString() === item.product._id);
            return {
                product: relatedProduct._id,
                price: relatedProduct.price,
                image_url: relatedProduct.image_url,
                name: relatedProduct.name,
                user: req.user._id,
                qty: item.qty,
                sub_total: relatedProduct.price * item.qty
            }
        });

        // await CartItem.deleteMany({ user: req.user._id });
        await CartItem.bulkWrite(cartItems.map(item => {
            return {
                updateOne: {
                    filter: {
                        user: req.user._id,
                        product: item.product
                    },
                    update: item,
                    upsert: true
                }
            }
        }));

        return res.status(201).json(cartItems);
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

const updateCartItem = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const updatedQty = req.body.qty;

        if (typeof updatedQty !== 'number' || updatedQty <= 0) {
            return res.status(400).json({ error: 'Masukkan jumlah kuantitas yg valid!' });
        }

        const cartItem = await CartItem.findOne({ _id: id, user: userId });

        if (!cartItem) {
            return res.status(404).json({ error: 'Item keranjang tidak ditemukan!' });
        }

        const updatedSubTotal = cartItem.price * updatedQty;

        const result = await CartItem.updateOne(
            { _id: id, user: userId },
            { $set: { qty: updatedQty, sub_total: updatedSubTotal } }
        );

        if (result.nModified === 0) {
            return res.status(404).json({ error: 'Item kerangjang tidak ditemukan!' });
        }

        return res.status(200).json({ message: 'Item keranjang berhasil diperbarui' });
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
};

const getAllCart = async (req, res, next) => {
    try {
        let items =
            await CartItem
                .find({ user: req.user._id })
                .populate('product');

        return res.status(200).json(items);
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

const deleteCartItem = async (req, res, next) => {
    try {
        const { cartItemId } = req.params;
        const userId = req.user._id;

        await CartItem.deleteOne({ _id: cartItemId, user: userId });

        return res.status(204).send();
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
};

module.exports = {
    addCartItem,
    updateCartItem,
    getAllCart,
    deleteCartItem
}
