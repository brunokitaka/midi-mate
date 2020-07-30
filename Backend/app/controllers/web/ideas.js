/**
 * MODULES
 */
const empty = require('is-empty');  /* Check if data's empty. */
const fs = require("fs");


/**
 * SELECT USER IDEAS:
 * Deletes user's record, idea and suggestions.
 */
module.exports.selectUserIdeas = function (app, req, res) {

    /* Return packet standard composition. */
	let returnPacket = {
		"status": "",
		"msg": "",
		"data": {}
	};

	/* Database connection. */
	const connection = app.config.dbConnection();
	const model = new app.app.models.web.ideas(connection);

	/* Checks if the email exists in the databse. */
	model.selectUserIdeas(req.session.idUser, function (error, result) {

		/* Checks for error. */
		if (error) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.userEmail);
			console.log("Controller: selectUserIdeas");
			console.log("Msg: Error while searching for ideas!");
			console.log("Error(selectUserIdeas): " + error);
			console.log("==================================================\n");
			returnPacket.status = "error";
			returnPacket.msg = "Error while searching for ideas!";
			returnPacket.data = error;
            res.send(returnPacket);
            return;
		} 
		/* Checks if database response is empty. */
		else if (empty(result)) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.userEmail);
			console.log("Controller: selectUserIdeas");
			console.log("Msg: No idea was found!");
			console.log("Error(selectUserIdeas): Result is empty " + result.rows);
			console.log("==================================================\n");
			returnPacket.status = "none";
			returnPacket.msg = "No idea was found!";
            res.send(returnPacket);
            return;
		} else {
			/* Response. */
			returnPacket.status = "success";
			returnPacket.data = result;
            res.send(returnPacket);
            return;			
		}
	});
}