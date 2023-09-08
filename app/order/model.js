const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const Invoice = require('../invoice/model');

const orderSchema = Schema({
    order_number: {
        type: Number,
        unique: true
    },
    status: {
        type: String,
        enum: ['waiting_for_payment', 'processing', 'in_delivery', 'delivered'],
        default: 'waiting_for_payment'
    },
    delivery_fee: {
        type: Number,
        default: 0
    },
    delivery_address: {
        provinsi: { type: String, required: [true, 'Provinsi harus diisi.!'] },
        kabupaten_kota: { type: String, required: [true, 'Kabupatan/Kota harus diisi.!'] },
        kecamatan: { type: String, required: [true, 'Kecamatan harus diisi.!'] },
        kelurahan: { type: String, required: [true, 'Kelurahan harus diisi.!'] },
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    order_items: [
        {
            type: Schema.Types.ObjectId,
            ref: 'OrderItems'
        }
    ]
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
    if (!this.order_number) {
        const highestOrder = await this.constructor.findOne({}, 'order_number').sort('-order_number').exec();

        this.order_number = highestOrder ? highestOrder.order_number + 1 : 1;
    }
    next();
});

orderSchema.virtual('items_count').get(function () {
    return this.order_items.reduce((total, item) => total += item.qty, 0);
});

orderSchema.post('save', async function () {
    const sub_total = this.order_items.reduce((total, item) => {
        if (item.name && item.price && item.qty) {
            const itemSubTotal = item.price * item.qty;
            return total + itemSubTotal;
        }
        return total;
    }, 0);
    let invoice = new Invoice({
        user: this.user,
        order: this._id,
        sub_total: sub_total,
        delivery_fee: this.delivery_fee,
        total: sub_total + this.delivery_fee,
        delivery_address: this.delivery_address
    });
    await invoice.save();
});

module.exports = model('Order', orderSchema);
