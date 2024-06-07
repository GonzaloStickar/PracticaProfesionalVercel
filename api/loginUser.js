
const path = require('path');
const bcrypt = require('bcryptjs');
const { loginUserName, loginPassword } = require('./config.js');

const loginUserGET = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'components', 'login.htm'));
};

const loginUserPOSTwrong = (req, res) => {
    return res.status(401).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Login</title>
        </head>
        <body>
            <h1>Login</h1>
            <form action="/login" method="POST">
                <label for="username">Username:</label>
                <input type="text" id="username" name="username" required>
                <br>
                <label for="password">Password:</label>
                <input type="password" id="password" name="password" required>
                <br>
                <button type="submit">Login</button>
            </form>
            <div id="error_message">
                Credenciales incorrectas
            </div>
        </body>
        </html>
    `);
};

const comparePasswords = async (password) => {
    const passwordLogin = loginPassword;

    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, function (err, hash) {
            if (err) {
                reject(err);
            } else {
                bcrypt.compare(passwordLogin, hash, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    console.log("Passwords iguales:", result);
                    resolve(result);
                });
            }
        });
    });
};

const compareUsername = async (username) => {
    const usernameLogin = loginUserName;

    return new Promise((resolve, reject) => {
        bcrypt.hash(username, 10, function (err, hash) {
            if (err) {
                reject(err);
            } else {
                bcrypt.compare(usernameLogin, hash, function (err, result) {
                    if (err) {
                        reject(err);
                    }
                    console.log("Usernames iguales:", result);
                    resolve(result);
                });
            }
        });
    });
};

module.exports = {
    loginUserGET,
    loginUserPOSTwrong,
    comparePasswords,
    compareUsername
};