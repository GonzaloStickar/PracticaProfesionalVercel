require('dotenv').config();

const express = require('express');
const session = require('express-session');
var bodyParser = require('body-parser');
//const { sql } = require('@vercel/postgres');
const path = require('path');

const { main } = require('./main.js');
const { loginUserGET, loginUserPOSTwrong, comparePasswords, compareUsername } = require('./loginUser.js')
const { sessionSecret } = require('./config.js');
 
var app = express()
 
// create application/json parser
var jsonParser = bodyParser.json()
 
// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

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

const isAuth = (req, res, next) => {
	const { cookies } = req;
	if (cookies.session_id) {
		console.log("session_id exists");
		if (cookies.session_id===sessionSecret) {
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
    res.status(200).send("POST permitido en esta ruta.");
});










app.post("/login", urlencodedParser, async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log(username, password);

        let passwordsIguales = await comparePasswords(password);
        let usernamesIguales = await compareUsername(username);

        if (usernamesIguales && passwordsIguales) {
            res.cookie('session_id', sessionSecret);
            res.redirect('/dashboard')
        } else {
            return loginUserPOSTwrong(req, res);
        }

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