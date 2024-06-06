require('dotenv').config();

const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
//const { sql } = require('@vercel/postgres');
const path = require('path');

const { main } = require('./main.js');
const { loginUserGET } = require('./loginUser.js')
const { sessionSecret } = require('./config.js');

const app = express();

app.use(express.json());

//app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

app.use(express.static(path.join(__dirname, 'public', 'img')));

app.use((req, res, next) => {
    console.log(`${req.method}`);
    next();
});



function validateAuthToken(req, res, next) {
	console.log('Adentro de Auth Token');
	const {authorization}  = req.headers;
	if (authorization && authorization === '123') {
		next();
	} else {
		res.status(403).send({msg:'Forbidden. Credenciales Incorrectas'});
	}
}

const isAuth = (req, res, next) => {
	const {cookies} = req;
	if ('session_id' in cookies) {
		console.log("session_id exists");
		if (cookies.session_id===process.env.SESSION_SECRET) {
            next();
        } else {
            res.status(404).send("Página no encontrada");
        }
	} else {
        res.status(404).send("Página no encontrada");
    }
};

app.get('/dashboard', isAuth, (req, res) => {
	res.status(200).json({msg:"Estas en una ruta protejida"});
});

//Después del login, se va a direccionar a un POST, ya que sigue la misma ruta de "POST", después ya cambia
app.post('/dashboard', isAuth, (req, res) => { 
    res.status(405).send("POST permitido en esta ruta.");
});










app.post("/login", async (req, res) => {
    try {

        const { username, password } = req.body;

        const passwordLoginHash = process.env.loginPassword;
        const passwordsIguales = await bcrypt.compare(password, passwordLoginHash);
        console.log(passwordsIguales);

        if (!passwordsIguales) {
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
        }

        res.cookie('session_id', process.env.SESSION_SECRET);
        res.redirect('/dashboard')

    } catch (error) {
        return res.status(500).json({
            msg: error.message,
        });
    }
});

app.get("/login", loginUserGET);

app.get("/inicio", main);

app.get("/", (req, res) => { 
    res.redirect('/inicio');
});

app.get("*", (req, res) => {
    res.status(404).send("Página no encontrada");
});

app.listen(() => console.log('Server ready on port 3000.'));

module.exports = app;