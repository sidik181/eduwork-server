const Category = require('./model');

const addCategory = async (req, res, next) => {
    try {
        let payload = req.body;
        let category = new Category(payload);
        await category.save();
        return res.json(category);
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

const editCatogoryById = async (req, res, next) => {
    try {
        let payload = req.body;
        let category = await Category.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true
        });
        return res.json(category);
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

const deleteCategoryById = async (req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        return res.json({
            status: 200,
            message: 'Kategori berhasil dihapus'
        });
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

const getAllCategory = async (req, res, next) => {
    try {
        let category = await Category.find();
        return res.json(category);
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

module.exports = {
    addCategory,
    editCatogoryById,
    deleteCategoryById,
    getAllCategory
}