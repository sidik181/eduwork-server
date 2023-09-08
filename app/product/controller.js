const path = require('path');
const fs = require('fs');
const config = require('../config');
const mongoose = require('mongoose');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');

const addProduct = async (req, res, next) => {
    try {
        let payload = req.body;

        if (payload.category) {
            let category = await Category.findOne({
                name: { $regex: payload.category, $options: 'i' }
            });
            if (category) {
                payload = { ...payload, category: category._id };
            } else {
                delete payload.category;
            }
        }

        if (payload.tags) {
            let tags = await Tag.find({
                name: { $in: payload.tags }
            });
            if (tags && tags.length > 0) {
                payload = { ...payload, tags: tags.map(tag => tag._id) };
            } else {
                delete payload.tags;
            }
        }

        if (req.file) {
            let tmpPath = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let fileName = req.file.filename + '.' + originalExt;
            let targetPath = path.resolve(config.rootPath, `public/images/products/${fileName}`);

            const src = fs.createReadStream(tmpPath);
            const dest = fs.createWriteStream(targetPath);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    let product = new Product({ ...payload, image_url: fileName });
                    await product.save();
                    return res.json(product);
                } catch (err) {
                    fs.unlinkSync(targetPath);
                    if (err && err.name === 'ValidationError') {
                        return res.json({
                            error: 500,
                            message: err.message,
                            fields: err.errors
                        });
                    }

                    next(err);
                }
            });

            src.on('error', async () => {
                next(err);
            });
        } else {
            let product = new Product(payload);
            await product.save();
            return res.json(product);
        }
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

const getProducts = async (req, res, next) => {
    let { skip = 0, limit = 10, q = '', category = '', tags = [] } = req.query;
    let criteria = {};

    if (q.length) {
        criteria.name = { $regex: `${q}`, $options: 'i' }
    }

    if (category.length) {
        let categoryResult = await Category.findOne({ name: { $regex: `${category}`, $options: 'i' } });
        if (categoryResult) {
            criteria.category = categoryResult._id;
        }
    }

    if (tags.length) {
        let tagsResult = await Tag.find({
            name: { $in: tags }
        });
        if (tagsResult.length > 0) {
            criteria.tags = { $in: tagsResult.map(tag => tag._id) };
        }
    }

    try {
        count = await Product.find(criteria).countDocuments();
        let message = 'Produk tidak ada'

        let product = await Product
            .find(criteria)
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate('category')
            .populate('tags');

        if (q && category && tags && product.length === 0) {
            return res.json({
                message: 'Produk tidak ditemukan sesuai filter yang diberikan.',
                data: [],
                count: count
            });
        } else if (q && product.length === 0) {
            return res.json({
                message: `Nama produk ${q} tidak ada.`,
                data: [],
                count: count
            });
        } else if (category && product.length === 0) {
            return res.json({
                message: `Kategori ${category} tidak ada.`,
                data: [],
                count: count
            });
        } else if (tags && product.length === 0) {
            return res.json({
                message: `Tag ${tags} tidak ada.`,
                data: [],
                count: count
            });
        }

        if (product.length === 0) {
            return res.status(404).json({ message });
        }

        return res.json({
            data: product,
            count
        });
    } catch (err) {
        next(err);
    }
};

const editProductbyId = async (req, res, next) => {
    try {
        let payload = req.body;
        let { id } = req.params;

        if (payload.category) {
            let category = await Category.findOne({
                name: { $regex: payload.category, $options: 'i' }
            });
            if (category) {
                payload = { ...payload, category: category._id };
            } else {
                delete payload.category;
            }
        }

        if (payload.tags && payload.tags.length > 0) {
            let tags = await Tag.find({
                name: { $in: payload.tags }
            });
            if (tags) {
                payload = { ...payload, tags: tags.map(tag => tag._id) };
            } else {
                delete payload.tags;
            }
        }

        if (req.file) {
            let tmpPath = req.file.path;
            let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
            let fileName = req.file.filename + '.' + originalExt;
            let targetPath = path.resolve(config.rootPath, `public/images/products/${fileName}`);

            const src = fs.createReadStream(tmpPath);
            const dest = fs.createWriteStream(targetPath);
            src.pipe(dest);

            src.on('end', async () => {
                try {
                    let product = await Product.findById(id);
                    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
                    if (fs.existsSync(currentImage)) {
                        fs.unlinkSync(currentImage);
                    }

                    product = await Product.findByIdAndUpdate(id, payload, {
                        new: true,
                        runValidators: true
                    });
                    return res.json(product);
                } catch (err) {
                    fs.unlinkSync(targetPath);
                    if (err && err.name === 'ValidationError') {
                        return res.json({
                            error: 400,
                            message: err.message,
                            fields: err.errors
                        });
                    }

                    next(err);
                }
            });

            src.on('error', async () => {
                next(err);
            });
        } else {
            let product = await Product.findByIdAndUpdate(id, payload, {
                new: true,
                runValidators: true
            });
            return res.json(product);
        }
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

const deleteProductById = async (req, res, next) => {
    try {
        let product = await Product.findByIdAndDelete(req.params.id);

        let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
        if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
        }

        return res.json({
            status: 200,
            message: 'Produk berhasil dihapus'
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    addProduct,
    getProducts,
    editProductbyId,
    deleteProductById
}
