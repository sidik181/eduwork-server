const Tag = require('./model');
const Category = require('../category/model')
const Product = require('../product/model')

const addTag = async (req, res, next) => {
    try {
        let payload = req.body;
        let tag = new Tag(payload);
        await tag.save();
        return res.status(201).json(tag);
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

const getTagById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tag = await Tag.findById(id);

        if (!tag) {
            return res.status(404).json({ message: 'Tag tidak ditemukan' });
        }

        return res.status(200).json(tag);
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

const editTagById = async (req, res, next) => {
    try {
        let payload = req.body;
        let tag = await Tag.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true
        });
        return res.status(201).json(tag);
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

const deleteTagById = async (req, res, next) => {
    try {
        const tagId = req.params.id;
        const productUsingTag = await Product.findOne({ tags: tagId });

        if (productUsingTag) {
            return res.status(400).json({
                message: 'Tag tidak dapat dihapus karena sedang digunakan oleh produk.'
            });
        }

        await Tag.findByIdAndDelete(tagId);
        return res.json({
            status: 200,
            message: 'Tag berhasil dihapus'
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


const getAllTag = async (req, res, next) => {
    try {
        let tag = await Tag.find();
        return res.status(200).json(tag);
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

const getTagsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const categoryId = await Category.findOne({ name: { $regex: category, $options: 'i' } });
        const products = await Product.find({ category: categoryId });
        let tagIds = [];
        products.forEach(product => {
            product.tags.forEach(tag => {
                if (!tagIds.includes(tag)) {
                    tagIds.push(tag)
                }
            });
        });

        const tags = await Tag.find({ _id: { $in: tagIds } });
        res.status(200).json(tags);
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
    addTag,
    editTagById,
    deleteTagById,
    getAllTag,
    getTagsByCategory,
    getTagById
}