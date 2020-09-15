/**
 * MODULES
 */
const empty = require('is-empty');  /* Check if data's empty. */
var fs = require('fs');
var rimraf = require("rimraf");
const { exec } = require('child_process');

/**
 * SAVE IDEA:
 * Inserts new idea into database.
 */
module.exports.insertIdea = function (app, req, res, ideaInfo, savePath, fileName) {

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
			console.log("Email: " + req.session.email);
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
			console.log("Email: " + req.session.email);
			console.log("Controller: insertIdea");
			console.log("Msg: Error while inserting new idea!");
			console.log("Error(insertIdea): Result is empty " + result.rows);
			console.log("==================================================\n");
			returnPacket.status = "none";
			returnPacket.msg = "Error while inserting new idea!";
            res.send(returnPacket);
            return;
		} else {

			ideaProcessing(savePath, fileName, result.insertId);

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
module.exports.deleteIdea = function (app, req, res) {
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
			console.log("Email: " + req.session.email);
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
			console.log("Email: " + req.session.email);
			console.log("Controller: deleteIdea");
			console.log("Msg: No idea was deleted!");
			console.log("Error(deleteIdea): Result is empty " + result.rows);
			console.log("==================================================\n");
			returnPacket.status = "none";
			returnPacket.msg = "No idea was deleted!";
            res.send(returnPacket);
            return;
		} else {
			
			let wavFilePath = "uploads/wav/" + req.session.idUser + "-" + idea.name + ".wav";
			let rawFilePath = "uploads/raw/" + req.session.idUser + "-" + idea.name + ".m4a";		
			let midiFilePath = "uploads/midi/" + req.session.idUser + "-" + idea.name + ".mid";
			let suggestionsFolderPath = "uploads/suggestion/" + idea.idIdeaApp + "/";

			try{
				fs.unlinkSync(wavFilePath);
				fs.unlinkSync(rawFilePath);		
				fs.unlinkSync(midiFilePath);
				rimraf(suggestionsFolderPath, function(error){
					if(error){
						console.log("==================================================");
						console.log("DateTime: " + Date(Date.now()).toString());
						console.log("Email: " + req.session.email);
						console.log("Controller: deleteIdeaMobile");
						console.log("Msg: Error whiile deleting folder!");
						console.log("Error: " + error);
						console.log("==================================================\n");
					}
					else{
						/* Response. */
						returnPacket.status = "success";
						returnPacket.msg = "Idea deleted successfully!";
						res.send(returnPacket);
						return;	
					}
				});
			}
			catch(error){
				console.log("==================================================");
				console.log("DateTime: " + Date(Date.now()).toString());
				console.log("Email: " + req.session.email);
				console.log("Controller: deleteIdeaMobile");
				console.log("Msg: Error whiile deleting files!");
				console.log("Error: " + error);
				console.log("==================================================\n");
				/* Response. */
				returnPacket.status = "success";
				returnPacket.msg = "Idea deleted successfully!";
				res.send(returnPacket);
				return;		
			}	
		}
	});
}

async function ideaProcessing(savePath, fileName, idIdea) {
	let cmd = "ffmpeg -i " + savePath + " " + "uploads/wav/" + fileName + ".wav";
	console.log("Running: " + cmd);

	exec(cmd, (error, stdout, stderr) => {
		if (error) {
			console.log("Error while converting file!");
			console.log(`error: ${error.message}`);
			res.send({
				"status": "error",
				"msg": "Could not convert file.",
				"data": {}
			});
			return;
		}

		console.log("File converted to .wav successfully!");

		let wavPath = "uploads/wav/" + fileName + ".wav"
		let midiSavePath = "uploads/midi/" + fileName + ".mid"
		// let cmdMidi = "audio-to-midi " + wavPath + " " + "-o " + midiSavePath + " --time-window 480 --activation-level 0.0 -s -c";
		let cmdMidi = "/home/ubuntu/miniconda3/envs/melodia/bin/python ./audio_to_midi_melodia/audio_to_midi_melodia.py " + wavPath + " " + midiSavePath + " 125 --smooth 0.25 --minduration 0.1";
		console.log("Running: " + cmdMidi);
		exec(cmdMidi, (error, stdout, stderr) => {
			if (error) {
				console.log("Error while converting file to midi!");
				console.log(`error: ${error.message}`);
				return;
			}

			console.log("File converted to .mid successfully!");

			let suggestionsOutputDir = "uploads/suggestion" + idIdea;
			let cmdGenerateSuggestions = "melody_rnn_generate \\" +
				"--config=attention_rnn \\" +
				"--run_dir=magenta/melody_rnn/logdir/run1 \\" +
				"--output_dir=" + suggestionsOutputDir + " \\" +
				"--num_outputs=3 \\" +
				"--num_steps=128 \\" +
				"--hparams=\"batch_size=64,rnn_layer_sizes=[64,64]\" \\" +
				"--primer_midi=" + midiSavePath;
			
			console.log("Running: " + cmdGenerateSuggestions);
			exec(cmdGenerateSuggestions, (error, stdout, stderr) => {
				if (error) {
					console.log("Error while generating suggestions!");
					console.log(`error: ${error.message}`);
					return;
				}

				console.log("Suggestions successfully generated!");
				console.log("==================================================");
			});
		});
	});
}