/**
 * MODULES
 */
const {
    check,
    validationResult
} = require('express-validator'); /* Request data validator. */
let multer = require('multer');
let fs = require('fs');
let upload = multer({
    dest: 'uploads/'
});
const {
    exec
} = require("child_process");


module.exports = function (app) {

    /**
     * SEND RECORD:
     * Receives voice records from mobile app.
     */
    app.post('/sendRecord', upload.single("record"), function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.mobile.login.isValid;

        /* Checks route permission. */
        if (
            req.session.token != undefined &&
            isValid(req.session.email + req.session.idUser, req.session.token)
        ) {
            console.log("==================================================");
            console.log("Received file " + req.file.originalname + " from user " + req.session.email);

            let fileName = req.file.originalname;
            let savePath = 'uploads/raw/' + req.session.idUser + "-" + req.body.idIdea + "-" + req.file.originalname;
            let src = fs.createReadStream(req.file.path);
            let dest = fs.createWriteStream(savePath);

            src.pipe(dest);

            src.on('end', function () {
                fs.unlinkSync(req.file.path);
                // res.send(
                //     {
                //         "status": "success",
                //         "msg": "File received!",
                //         "data": {}
                //     }
                // );

                console.log("File saved!");

                fileName = fileName.split(".")[0];
                let ideaName = fileName;
                fileName = req.session.idUser + "-" + req.body.idIdea + "-" + fileName;

                ideaProcessing(savePath, fileName);

                let ideaInfo = {
                    "id": req.body.idIdea,
                    "name": ideaName,
                    "path": fileName,
                    "idUser": req.session.idUser
                };

                app.app.controllers.mobile.ideas.insertIdea(app, req, res, ideaInfo);
            });

            src.on('error', function (err) {
                res.send({
                    "status": "error",
                    "msg": "Could not save file.",
                    "data": {}
                });
            });
        } else {
            res.send({
                "status": "error",
                "msg": "Could not send file, session is not valid.",
                "data": {}
            });
        }
    });


    /**
     * DELETE IDEA:
     * Deletes user's record, idea and suggestions.
     */
    app.post('/deleteIdea',
        [
            check('idIdea', 'Invalid ID!').not().isEmpty().isNumeric(),
            check('name', 'Invalid name!').not().isEmpty().escape()
        ],
        function (req, res) {
            /* Gets isValid() instance. */
            const isValid = app.app.controllers.web.login.isValid;

            /* Checks route permission. */
            if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token)) {

                /* Receives data validation errors, if any. */
                const errors = validationResult(req)

                /* If error, sends error message. */
                if (!errors.isEmpty()) {
                    res.send({
                        status: "error",
                        msg: errors.array()
                    });
                    return;
                } else {
                    app.app.controllers.mobile.ideas.deleteIdea(app, req, res);
                }
            }
        });

    async function ideaProcessing(savePath, fileName) {
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
            let cmdMidi = "audio-to-midi " + wavPath + " " + "-o " + midiSavePath + " --time-window 480 --activation-level 0.0 -s -c";
            console.log("Running: " + cmdMidi);
            exec(cmdMidi, (error, stdout, stderr) => {
                if (error) {
                    console.log("Error while converting file to midi!");
                    console.log(`error: ${error.message}`);
                    res.send({
                        "status": "error",
                        "msg": "Could not convert file to midi.",
                        "data": {}
                    });
                    return;
                }

                console.log("File converted to .mid successfully!");

                let suggestionsOutputDir = "uploads/suggestion"
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
                        res.send({
                            "status": "error",
                            "msg": "Could not generate suggestions.",
                            "data": {}
                        });
                        return;
                    }

                    console.log("Suggestions successfully generated!");
                    console.log("==================================================");
                });
            });
        });
    }
}