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
 * UPDATE USER WITH PASSWORD:
 * Inserts updated user data in database including password.
 */
module.exports.updateUserWithPassword = function (app, req, res) {
	/* Return packet standard composition. */
	let returnPacket = {
		"status": "",
		"msg": "",
		"data": {}
	};

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
	model.updateUserWithPassword(user, function (error, result) {

		/* Checks for error. */
		if (error) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.email);
			console.log("Controller: updateUserWithPassword");
			console.log("Msg: Error while updating user!");
			console.log("Error(updateUserWithPassword): " + error);
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
			console.log("Controller: updateUserWithPassword");
			console.log("Msg: Error, no user was updated!");
			console.log("Error(updateUserWithPassword): Result is empty" + result);
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

}

/**
 * UPDATE USER WITHOUT PASSWORD:
 * Inserts updated user data in database without password.
 */
module.exports.updateUserWithoutPassword = function (app, req, res) {
	/* Return packet standard composition. */
	let returnPacket = {
		"status": "",
		"msg": "",
		"data": {}
	};

	/* Data from request. */
	let user = req.body;

	/* Sets user id. */
	user.idUser = req.session.idUser;

	/* Freezes object, making it unalterable. */
	Object.freeze(user);

	/* Database connection. */
	const connection = app.config.dbConnection();
	const model = new app.app.models.web.user(connection);

	/* Calls query for updating user data. */
	model.updateUserWithoutPassword(user, function (error, result) {

		/* Checks for error. */
		if (error) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.email);
			console.log("Controller: updateUserWithoutPassword");
			console.log("Msg: Error while updating user!");
			console.log("Error(updateUserWithoutPassword): " + error);
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
			console.log("Controller: updateUserWithoutPassword");
			console.log("Msg: Error, no user was updated!");
			console.log("Error(updateUserWithoutPassword): Result is empty" + result);
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
}

/**
 * GET USER INFO:
 * Selects user info in database.
 */
module.exports.getUserInfo = function (app, req, res) {

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
	model.getUserInfo(req.session.idUser, function (error, result) {

		/* Checks for error. */
		if (error) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.email);
			console.log("Controller: getUserInfo");
			console.log("Msg: Database error while searching for user data!");
			console.log("Error(getUserInfo): " + error);
			console.log("==================================================\n");
			returnPacket.status = "error";
			returnPacket.msg = "Error while searching for user data!";
			returnPacket.data = error;
            res.send(returnPacket);
            return;
		}
		/* Checks if database response is empty. */
		else if (empty(result)) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.email);
			console.log("Controller: getUserInfo");
			console.log("Msg: Error, no user was found!");
			console.log("Error(getUserInfo): Result is empty" + result);
			console.log("==================================================\n");
			returnPacket.status = "none";
			returnPacket.msg = "Error, no user was found!";
            res.send(returnPacket);
            return;
		} else {

			/* Response */
			returnPacket.status = "success";
			returnPacket.msg = "User data successfully retrieved!";
			returnPacket.data = result[0];
			res.send(returnPacket);
			return;
		}
	});
}

