const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = Schema({
    full_name: {
        type: String,
        minlength: [3, 'Panjang nama minimal 3 karakter'],
        maxlength: [50, 'Panjang nama maksimal 50 karakter'],
        required: [true, 'Nama lengkap harus diisi']
    },
    customer_id: {
        type: Number,
        unique: true
    },
    email: {
        type: String,
        maxlength: [100, 'Panjang email maksimal 100 karakter'],
        required: [true, 'Email harus diisi']
    },
    password: {
        type: String,
        minlength: [6, 'Panjang password minimal 6 karakter'],
        maxlength: [50, 'Panjang password maksimal 50 karakter'],
        required: [true, 'Password harus diisi']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

    token: [String]

}, { timestamps: true });

userSchema.path('email').validate(function (value) {
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return EMAIL_RE.test(value);
}, attr => `${attr.value} harus merupakan email yang valid!`);

userSchema.path('email').validate(async function (value) {
    if (this.isNew) {
        const existingUser = await this.model('User').findOne({ email: value });
        return !existingUser;
    }
    return true;
}, attr => `${attr.value} sudah terdaftar`);

const HASH_ROUND = 10;
userSchema.pre('save', async function (next) {
    try {
        const hash = await bcrypt.hash(this.password, HASH_ROUND);
        this.password = hash;
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.pre('save', async function (next) {
    if (!this.customer_id) {
        const highestCustomer = await this.constructor.findOne({}, 'customer_id').sort('-customer_id').exec();

        this.customer_id = highestCustomer ? highestCustomer.customer_id + 1 : 1;
    }
    next();
});

module.exports = model('User', userSchema);
