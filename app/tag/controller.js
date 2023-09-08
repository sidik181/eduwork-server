const Tag = require('./model');

const addTag = async (req, res, next) => {
    try {
        let payload = req.body;
        let tag = new Tag(payload);
        await tag.save();
        return res.json(tag);
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

const editTagById = async (req, res, next) => {
    try {
        let payload = req.body;
        let tag = await Tag.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true
        });
        return res.json(tag);
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

const deleteTagById = async (req, res, next) => {
    try {
        await Tag.findByIdAndDelete(req.params.id);
        return res.json({
            status: 200,
            message: 'Tag berhasil dihapus'
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

const getAllTag = async (req, res, next) => {
    try {
        let tag = await Tag.find();
        return res.json(tag);
    } catch (err) {
        if (err && err.name === 'ValidationError') {
            return res.json({
                error: 1,
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
    getAllTag
}