/**
 * MODULES
 */
const bcrypt = require('bcryptjs'); /* Hash generator.        */
const empty = require('is-empty');  /* Check if data's empty. */


/**
 * INSERT USER:
 * Inserts new user data in database.
 */
module.exports.insertUser = function (app, req, res) {
	/* Data from request. */
	let user = req.body;

	/* Creates hash from user's password */
	user.userPassword = bcrypt.hashSync(user.userPassword, 11);

	/* Freezes object, making it unalterable. */
	Object.freeze(user);

	/* Return packet standard composition. */
	let returnPacket = {
		"status": "",
		"msg": "",
		"data": {}
	};

	/* Database connection. */
	const connection = app.config.dbConnection();
	const model = new app.app.models.web.user(connection);

	/* Calls query for insert user in database. */
	model.insertUser(user, function (error, result) {

		/* Checks for error. */
		if (error) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + user.userEmail);
			console.log("Controller: insertUser");
			console.log("Msg: Database error while inserting new user!");
			console.log("Error(insertUser): " + error);
			console.log("==================================================\n");
			returnPacket.status = "error";
			returnPacket.msg = "Error while creating new user!";
			returnPacket.data = error;
            res.send(returnPacket);
            return;
		}
		/* Checks if database response is empty. */
		else if (empty(result) || result.affectedRows == 0) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + user.userEmail);
			console.log("Controller: insertUser");
			console.log("Msg: Error, no user was created!");
			console.log("Error(insertUser): Result is empty" + result);
			console.log("==================================================\n");
			returnPacket.status = "none";
			returnPacket.msg = "Error, no user was created!";
            res.send(returnPacket);
            return;
		} else {

			/* Response */
			returnPacket.status = "success";
			returnPacket.msg = "User successfully created!";
			res.send(returnPacket);
			return;
		}
	});
}

/**
 * UPDATE USER:
 * Inserts updated user data in database.
 */
module.exports.updateUser = function (app, req, res) {
	/* Return packet standard composition. */
	let returnPacket = {
		"status": "",
		"msg": "",
		"data": {}
	};

    /* Checks controller permission. */
	if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token)) {

		/* Data from request. */
		let user = req.body;

		/* Sets user id. */
		user.idUser = req.session.idUser;
		/* Creates hash from user's password */
		user.userPassword = bcrypt.hashSync(user.userPassword, 11);

		/* Freezes object, making it unalterable. */
		Object.freeze(user);

		/* Database connection. */
		const connection = app.config.dbConnection();
		const model = new app.app.models.web.user(connection);

		/* Calls query for updating user data. */
		model.updateUser(user, function (error, result) {

			/* Checks for error. */
			if (error) {
				console.log("==================================================");
				console.log("DateTime: " + Date(Date.now()).toString());
				console.log("Email: " + req.session.email);
				console.log("Controller: updateUser");
				console.log("Msg: Error while updating user!");
				console.log("Error(updateUser): " + error);
				console.log("==================================================\n");
				returnPacket.status = "error";
				returnPacket.msg = "Error while updating user!";
				returnPacket.data = error;
				res.send(returnPacket);
				return;
			}
			/* Checks if database response is empty. */
			else if (empty(result) || result.affectedRows == 0) {
				console.log("==================================================");
				console.log("DateTime: " + Date(Date.now()).toString());
				console.log("Email: " + req.session.email);
				console.log("Controller: updateUser");
				console.log("Msg: Error, no user was updated!");
				console.log("Error(updateUser): Result is empty" + result);
				console.log("==================================================\n");
				returnPacket.status = "none";
				returnPacket.msg = "Error, no user was updated!";
				res.send(returnPacket);
				return;
			} else {

				/* Response */
				returnPacket.status = "success";
				returnPacket.msg = "User updated successfully!";
				res.send(returnPacket);
				return;
			}
		});
	} else {
		/*Envio da respostas*/
		returnPacket.status = "error";
		returnPacket.msg = "Access denied!";
		res.send(returnPacket);
		return;
	}
}

