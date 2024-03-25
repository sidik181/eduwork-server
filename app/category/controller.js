const Category = require('./model');
const Product = require('../product/model')

const addCategory = async (req, res, next) => {
    try {
        let payload = req.body;
        let category = new Category(payload);
        await category.save();
        return res.status(200).json(category);
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

const getCategoryById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).json({ message: 'Kategori tidak ditemukan' });
        }

        return res.status(200).json(category);
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
};

const editCatogoryById = async (req, res, next) => {
    try {
        let payload = req.body;
        let category = await Category.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true
        });
        return res.status(201).json(category);
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

const deleteCategoryById = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const productUsingCategory = await Product.findOne({ category: categoryId });

        if (productUsingCategory) {
            return res.status(400).json({
                message: 'Kategori tidak dapat dihapus karena sedang digunakan oleh produk.'
            });
        }

        await Category.findByIdAndDelete(categoryId);
        return res.json({
            status: 200,
            message: 'Kategori berhasil dihapus'
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
};


const getAllCategory = async (req, res, next) => {
    try {
        let category = await Category.find();
        return res.status(200).json(category);
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
    addCategory,
    editCatogoryById,
    deleteCategoryById,
    getAllCategory,
    getCategoryById
}