const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const cartItemSchema = Schema({
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
        default: 0
    },
    sub_total: {
        type: Number,
    },
    image_url: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }
});

module.exports = model('CartItem', cartItemSchema);
