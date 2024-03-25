const User = require('./model')

const addUser = async (req, res, next) => {
    try {
        const payload = req.body;
        let user = new User(payload);
        await user.save();
        return res.status(201).json(user);
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

const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User tidak ditemukan' });
        }

        return res.status(200).json(user);
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

const getAllUser = async (req, res, next) => {
    try {
        let users = await User.find();
        return res.status(200).json(users);
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

const editUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const payload = req.body;

        if (payload.email) {
            const existingUser = await User.findOne({ email: payload.email });

            if (existingUser && !existingUser._id.equals(id)) {
                return res.status(400).json({
                    error: true,
                    message: "Email sudah terdaftar dengan user lain."
                });
            }
        }

        let user = await User.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true
        });

        return res.status(201).json(user);
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

const deleteUserById = async (req, res, next) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        return res.json({
            status: 200,
            message: 'User berhasil dihapus'
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
}

module.exports = {
    addUser,
    getAllUser,
    editUserById,
    deleteUserById,
    getUserById
}