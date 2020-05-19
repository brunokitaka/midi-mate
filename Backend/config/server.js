/**
 * MODULES
 */
const express = require('express');                  /* Basic server configuration. */
const consign = require('consign');                  /* Application paths handler.  */
const bodyParser = require('body-parser');           /* Request's data parser.      */
const expressSession = require('express-session');   /* Session manager.            */

/**
 * SERVER
 */

/* Express initialization. */
let app = express();

/* Sets .ejs as the standart view engine. */
app.set('view engine', 'ejs');

/* Sets the path to the .ejs files. */
app.set('views', './app/views');

/* Sets the public/static paths, which contains front-end files. */
app.use(express.static('./app/public'));

/* Sets the arriving data as url encoded (form JSON). */
app.use(bodyParser.urlencoded({extended: false }));

/* Sets the arriving data as JSON. */
app.use(bodyParser.json());

/**
 * Sets the session configurations.
 * We'll use SQLite to store sessions, avoiding RAM overload.
 */
app.use(expressSession({
	store: new SQLiteStore,
	secret: 'mymidisecret',
	cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, /* 1 week. */
	resave: true,
    saveUninitialized: true
}));

/* Sets all the paths from the project for the consign module. */
consign()
	.include('app/routes')
	.then('config/envConfig.js')
	.then('config/dbConnection.js')
	.then('app/models')
	.then('app/controllers')  
    .into(app);
    
module.exports = app;
