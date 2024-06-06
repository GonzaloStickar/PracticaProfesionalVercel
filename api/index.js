require('dotenv').config();

const express = require('express');
const session = require('express-session');
//const cookieParser = require('cookie-parser');
//const { sql } = require('@vercel/postgres');
const path = require('path');

const { main } = require('./main.js');
const { loginUser } = require('./loginUser.js')

const app = express();

app.use(express.json());

//app.use(express.cookieParser(process.env.SESSION_SECRET))
//app.use(express.cookieSession());

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'somevalue',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


//app.use(session({
//    secret: process.env.SESSION_SECRET,
//    resave: false,
//    saveUninitialized: true,
//}));

app.use(express.static(path.join(__dirname, 'public', 'img')));


app.use((req, res, next) => {
    console.log(`${req.method}`);
    next();
}) 



function validateAuthToken(req, res, next) {
	console.log('Adentro de Auth Token');
	const {authorization}  = req.headers;
	if (authorization && authorization === '123') {
		next();
	} else {
		res.status(403).send({msg:'Forbidden. Credenciales Incorrectas'});
	}
}

function validateCookie(req, res, next) {
	const {cookies} = req;
	if ('session_id' in cookies) {
		console.log("session_id exists");
		if (cookies.session_id===process.env.secret) next();
		else res.status(403).send({msg:"no autorizado"});
	} else res.status(403).send({msg:"no autorizado"});
}

app.get("/loginTrucho", (req, res) => {
	res.cookie('session_id', '123456');
	res.status(200).json({msg:"logeado"});
})

app.get("/todosLoginTrucho", validateCookie, (req, res) => {
	res.status(200).json({msg:"Estas en una ruta protejida"});
})

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (username !== process.env.loginUserName || password !== process.env.loginPassword) {
            return res.status(200).json({
                msg: "Bad."
            });
        } else {
            return res.status(200).json({
                msg: "Ok."
            });
        }
    } catch (error) {
        return res.status(500).json({
            msg: error.message,
        });
    }
});

app.get("/login", loginUser)

app.get("/inicio", main)

app.get("/", (req, res) => { 
    res.redirect('/inicio');
});

app.get("*", (req, res) => {
    res.status(404).send("Página no encontrada");
});

app.listen(() => console.log('Server ready on port 3000.'));

module.exports = app;