/**
 * MODULES
 */
const bcrypt = require('bcryptjs'); /* Hash generator.        */
const empty = require('is-empty');  /* Check if data's empty. */
const token = require('token');     /* Session token.         */

/**
 * TOKEN CONFIG
 */
const tokenSecret = process.env.TOKEN_SECRET
token.defaults.secret = tokenSecret;
token.defaults.timeStep = 60 * 60; /* 1 hour. */


/**
 * IS VALID:
 * Checks if session's token is valid.
 */
module.exports.isValid = function (a, b) {
	return token.verify(a, b);
}


/**
 * USER WEB AUTH:
 * Compares login data with database.
 * If all matches, a new session is created. 
 */
module.exports.userWebAuth = function (app, req, res) {
	/* Data from request. */
	const login = req.body;

	/* Return packet standard composition. */
	let returnPacket = {
		"status": "",
		"msg": "",
		"data": {}
	};

	/* Database connection. */
	const connection = app.config.dbConnection();
	const model = new app.app.models.web.login(connection);

	/* Checks if the email exists in the databse. */
	model.userWebAuth(login, function (error, result) {
	
		/* Checks for error. */
		if (error) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + login.userEmail);
			console.log("Controller: userWebAuth");
			console.log("Msg: Error while searching for user!");
			console.log("Error(userWebAuth): " + error);
			console.log("==================================================\n");
			returnPacket.status = "error";
			returnPacket.msg = "Error while searching for user!";
			returnPacket.data = error;
            res.send(returnPacket);
            return;
		} 
		/* Checks if database response is empty. */
		else if (empty(result)) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + login.userEmail);
			console.log("Controller: userWebAuth");
			console.log("Msg: No user was found!");
			console.log("Error(userWebAuth): Result is empty" + result);
			console.log("==================================================\n");
			returnPacket.status = "none";
			returnPacket.msg = "User not found!";
            res.send(returnPacket);
            return;
		} else {

			/* If user found, stored password hash is compared with login's. */
			if (bcrypt.compareSync(login.userPassword, result[0].userPassword)) {

				/* Creates new session. */
				req.session.email = result[0].userEmail;
				req.session.idUser = result[0].idUser;
				req.session.token = token.generate(req.session.email + req.session.idUser.toString());
				
				/* Response. */
				returnPacket.status = "success";
				returnPacket.msg = "Welcome!";
				res.send(returnPacket);
				return;
			} 
			/* If passwords don't match. */
			else {
				/* Response. */
				returnPacket.status = "error";
				returnPacket.msg = "Check login data!";
				res.send(returnPacket);
				return;
			}
		}
	});
}



