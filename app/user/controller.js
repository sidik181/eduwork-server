const User = require('./model')

const addUser = async (req, res, next) => {
    try {
        const payload = req.body;
        let user = new User(payload);
        await user.save();
        return res.json(user);
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

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        return res.json(user);
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

const getAllUser = async (req, res, next) => {
    try {
        let users = await User.find();
        return res.json(users);
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

const editUserById = async (req, res, next) => {
    try {
        let payload = req.body;
        let user = await User.findByIdAndUpdate(req.params.id, payload, {
            new: true,
            runValidators: true
        });
        return res.json(user);
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

const deleteUserById = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.json({
            status: 200,
            message: 'User berhasil dihapus'
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

module.exports = {
    addUser,
    getAllUser,
    editUserById,
    deleteUserById,
    getUserById
}