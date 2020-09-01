/**
 * MODULES
 */
const empty = require('is-empty');  /* Check if data's empty. */
const fs = require("fs");
const { exec } = require('child_process');

/**
 * SAVE IDEA:
 * Inserts new idea into database.
 */
module.exports.insertIdeaWeb = function (app, req, res, ideaInfo, savePath) {

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
	model.insertIdea(ideaInfo, function (error, result) {	

		/* Checks for error. */
		if (error) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.userEmail);
			console.log("Controller: insertIdeaWeb");
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
			console.log("Controller: insertIdeaWeb");
			console.log("Msg: Error while inserting new idea!");
			console.log("Error(insertIdea): Result is empty " + result.rows);
			console.log("==================================================\n");
			returnPacket.status = "none";
			returnPacket.msg = "Error while inserting new idea!";
            res.send(returnPacket);
            return;
		} else {
			/* Response. */
			
			ideaProcessing(savePath, result.insertId);

            returnPacket.status = "success";
            returnPacket.msg = "New idea inserted successfully!";
            res.send(returnPacket);
            return;			
		}
	});
}


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

async function ideaProcessing(savePath, idIdea) {
	let suggestionsOutputDir = "uploads/suggestion/" + idIdea;
	let cmdGenerateSuggestions = "melody_rnn_generate \\" +
		"--config=attention_rnn \\" +
		"--run_dir=magenta/melody_rnn/logdir/run1 \\" +
		"--output_dir=" + suggestionsOutputDir + " \\" +
		"--num_outputs=3 \\" +
		"--num_steps=128 \\" +
		"--hparams=\"batch_size=64,rnn_layer_sizes=[64,64]\" \\" +
		"--primer_midi=" + savePath;
	
	console.log("==================================================");
	console.log("Running: " + cmdGenerateSuggestions);
	exec(cmdGenerateSuggestions, (error, stdout, stderr) => {
		if (error) {
			console.log("Error while generating suggestions!");
			console.log(`error: ${error.message}`);
			res.send({
				"status": "error",
				"msg": "Could not generate suggestions.",
				"data": {}
			});
			return;
		}

		console.log("Suggestions successfully generated!");
		

		/* Rename magenta output to sequntial numbers (1,2,3) */
		let renameCmd = "a=1 \\" + 
						"for i in uploads/suggestion/" + idIdea + "/*.mid; do \\" +
						"new=$(printf \"%d.mid\" \"$a\") \\" +
						"mv -i -- \"$i\" \"$new\" \\" +
						"let a=a+1 \\" +
						"done"
		exec(renameCmd, (error, stdout, stderr) => {
			if(error){
				console.log("Error while renaming suggestions!");
				console.log(`error: ${error.message}`);
				console.log("==================================================");
			}
			console.log("Suggestions successfully renamed!");
			console.log("==================================================");
		});
	});
}