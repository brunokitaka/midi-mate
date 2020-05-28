/**
 * MODULES
 */
const empty = require('is-empty');  /* Check if data's empty. */
var fs = require('fs');

/**
 * SAVE IDEA:
 * Inserts new idea into database.
 */
module.exports.insertIdea = function (app, req, res, ideaInfo) {

    /* Return packet standard composition. */
	let returnPacket = {
		"status": "",
		"msg": "",
		"data": {}
	};

	/* Database connection. */
	const connection = app.config.dbConnection();
	const model = new app.app.models.mobile.ideas(connection);

	/* Checks if the email exists in the databse. */
	model.insertIdea(ideaInfo, function (error, result) {	

		/* Checks for error. */
		if (error) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.userEmail);
			console.log("Controller: insertIdea");
			console.log("Msg: Error while inserting new idea!");
			console.log("Error(insertIdea): " + error);
			console.log("==================================================\n");
			returnPacket.status = "error";
			returnPacket.msg = "Error while inserting new idea!";
			returnPacket.data = error;
            res.send(returnPacket);
            return;
		} 
		/* Checks if database response is empty. */
		else if (empty(result)) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.userEmail);
			console.log("Controller: insertIdea");
			console.log("Msg: Error while inserting new idea!");
			console.log("Error(insertIdea): Result is empty " + result.rows);
			console.log("==================================================\n");
			returnPacket.status = "none";
			returnPacket.msg = "Error while inserting new idea!";
            res.send(returnPacket);
            return;
		} else {
            /* Response. */
            returnPacket.status = "success";
            returnPacket.msg = "New idea inserted successfully!";
            res.send(returnPacket);
            return;			
		}
	});
}

/**
 * DELETE IDEA:
 * Deletes user's record, idea and suggestions.
 */
module.exports.deleteIdea = function (app, req, res, ideaInfo) {
	/* Data from request. */
	let idea = req.body;

	idea.idUser = req.session.idUser;

	/* Freezes object, making it unalterable. */
	Object.freeze(idea);

    /* Return packet standard composition. */
	let returnPacket = {
		"status": "",
		"msg": "",
		"data": {}
	};

	/* Database connection. */
	const connection = app.config.dbConnection();
	const model = new app.app.models.mobile.ideas(connection);

	/* Checks if the email exists in the databse. */
	model.deleteIdea(idea, function (error, result) {

		/* Checks for error. */
		if (error) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.userEmail);
			console.log("Controller: deleteIdea");
			console.log("Msg: Error while deleting idea!");
			console.log("Error(deleteIdea): " + error);
			console.log("==================================================\n");
			returnPacket.status = "error";
			returnPacket.msg = "Error while deleting idea!";
			returnPacket.data = error;
            res.send(returnPacket);
            return;
		} 
		/* Checks if database response is empty. */
		else if (empty(result)) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.userEmail);
			console.log("Controller: deleteIdea");
			console.log("Msg: No idea was deleted!");
			console.log("Error(deleteIdea): Result is empty " + result.rows);
			console.log("==================================================\n");
			returnPacket.status = "none";
			returnPacket.msg = "No idea was deleted!";
            res.send(returnPacket);
            return;
		} else {
			
			// TODO: Erase suggestion!
			
			let wavFilePath = "uploads/wav/" + req.session.idUser + "-" + idea.idIdea + "-" + idea.name + ".wav";
			let rawFilePath = "uploads/raw/" + req.session.idUser + "-" + idea.idIdea + "-" + idea.name + ".m4a";		

			fs.unlinkSync(wavFilePath);
			fs.unlinkSync(rawFilePath);		
			
			/* Response. */
            returnPacket.status = "success";
            returnPacket.msg = "Idea deleted successfully!";
            res.send(returnPacket);
            return;			
		}
	});
}