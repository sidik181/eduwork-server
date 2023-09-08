const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const orderItemsSchema = Schema({
    name: {
        type: String,
        minlength: [5, 'Panjang nama produk minimal 5 karakter'],
        required: [true, 'Nama harus diisi']
    },
    qty: {
        type: Number,
        required: [true, 'Quantity harus diisi'],
        min: [1, 'Minimal quantity adalah 1']
    },
    price: {
        type: Number,
        required: [true, 'Harga item harus diisi'],
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    order: {
        type: Schema.Types.ObjectId,
        ref: 'Order'
    },
});

module.exports = model('OrderItems', orderItemsSchema);
