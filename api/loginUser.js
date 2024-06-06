const path = require('path');

const loginUserGET = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'components', 'login.htm'));
};

module.exports = {
    loginUserGET,
};