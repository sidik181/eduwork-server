const mongoose = require('mongoose');
const { dbHost, dbPass, dbUser, dbName } = require('../app/config');

const devDbUrl = `mongodb+srv://${dbUser}:${dbPass}@${dbHost}/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(devDbUrl, {
    useUnifiedTopology: true,
    useNewUrlParser: true
});

const db = mongoose.connection;

module.exports = db;
