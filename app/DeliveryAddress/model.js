const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let deliveryAddressSchema = Schema({
    nama_alamat_pengiriman: {
        type: String,
        minlength: [3, 'Panjang nama alamat minimal 3 karakter'],
        maxlength: [50, 'Panjang nama alamat maksimal 50 karakter'],
        required: [true, 'Nama alamat harus diisi']
    },
    nama_jalan: {
        type: String,
        minlength: [3, 'Panjang nama jalan minimal 3 karakter'],
        maxlength: [255, 'Panjang nama jalan maksimal 255 karakter'],
        required: [true, 'Nama jalan harus diisi']
    },
    kelurahan: {
        type: String,
        maxlength: [255, 'Panjang nama kelurahan maksimal 255 karakter'],
        required: [true, 'Kelurahan harus diisi']
    },
    kecamatan: {
        type: String,
        maxlength: [255, 'Panjang nama kecamatan maksimal 255 karakter'],
        required: [true, 'Kecamatan harus diisi']
    },
    kabupaten_kota: {
        type: String,
        maxlength: [255, 'Panjang nama kabupaten/kota maksimal 255 karakter'],
        required: [true, 'Kabupaten/kota harus diisi']
    },
    provinsi: {
        type: String,
        maxlength: [255, 'Panjang nama provinsi maksimal 255 karakter'],
        required: [true, 'Provinsi harus diisi']
    },
    detail: {
        type: String,
        maxlength: [50, 'Panjang detail alamat maksimal 50 karakter'],
        required: [true, 'Detail alamat harus diisi']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
}, { timestamps: true });

module.exports = model('DeliveryAddress', deliveryAddressSchema);
