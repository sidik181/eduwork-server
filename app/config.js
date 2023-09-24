const dotenv = require('dotenv');

dotenv.config();
module.exports = {
    serviceName: process.env.SERVICE_NAME,
    secretKey: process.env.SECKRET_KEY,
    dbHost: process.env.DB_HOST_ATLAS,
    dbPort: process.env.DB_PORT_ATLAS,
    dbUser: process.env.DB_USER_ATLAS,
    dbPass: process.env.DB_PASS_ATLAS,
    dbName: process.env.DB_NAME_ATLAS,
}