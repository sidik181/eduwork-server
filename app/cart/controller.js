const Product = require('../product/model');
const CartItem = require('../cart-item/model');

const addCartItem = async (req, res, next) => {
    try {
        const { items } = req.body;
        const productIds = items.map(item => item.product._id);
        const products = await Product.find({ _id: { $in: productIds } });
        const cartItems = [];

        for (const item of items) {
            const relatedProduct = products.find(product => product._id.toString() === item.product._id);
            if (relatedProduct) {
                const existingCartItem = await CartItem.findOne({ user: req.user._id, product: relatedProduct._id });

                if (existingCartItem) {
                    existingCartItem.qty += item.qty;
                    existingCartItem.sub_total = relatedProduct.price * existingCartItem.qty;
                    await existingCartItem.save();
                    cartItems.push(existingCartItem);
                } else {
                    const newCartItem = new CartItem({
                        product: relatedProduct._id,
                        price: relatedProduct.price,
                        image_url: relatedProduct.image_url,
                        name: relatedProduct.name,
                        user: req.user._id,
                        qty: item.qty,
                        sub_total: relatedProduct.price * item.qty
                    });
                    await newCartItem.save();
                    cartItems.push(newCartItem);
                }
            }
        }

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
};

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

        const product = await Product.findById(cartItem.product);

        if (!product) {
            return res.status(404).json({ message: 'Produk tidak ditemukan di keranjang.!' });
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
        const { id } = req.params;

        await CartItem.deleteMany({ _id: { $in: id }, user: req.user._id });

        return res.status(200).json({ message: 'Peroduk berhasil dihapus dari keranjang' });
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
