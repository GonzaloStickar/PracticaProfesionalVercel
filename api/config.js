require('dotenv').config();

const sessionSecret = process.env.SESSION_SECRET;
const loginUserName = process.env.loginUserName;
const loginPassword = process.env.loginPassword;

module.exports = {
    sessionSecret,
    loginUserName,
    loginPassword
};