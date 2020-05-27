/**
 * MODULES
 */
const { check, validationResult } = require('express-validator'); /* Request data validator. */
var multer  = require('multer');
var fs = require('fs');
var upload = multer({ dest: 'uploads/' });
const { exec } = require("child_process");


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

            var fileName = req.file.originalname;
            var savePath = 'uploads/raw/' + req.session.idUser + "-" + req.file.originalname;
            var src = fs.createReadStream(req.file.path);
            var dest = fs.createWriteStream(savePath);

            src.pipe(dest);

            src.on('end', function() {
                fs.unlinkSync(req.file.path);
                res.send(
                    {
                        "status": "success",
                        "msg": "File received!",
                        "data": {}
                    }
                );

                console.log("File saved!");                

                fileName = fileName.split(".")[0];
                
                var cmd = "ffmpeg -i " + savePath + " " + "uploads/wav/" + fileName + ".wav";
                console.log("Running: " + cmd);
                
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        console.log("Error while converting file!");
                        console.log(`error: ${error.message}`);
                        return;
                    }
                    if (stderr) {
                        // console.log("Error while converting file!");
                        // console.log(`stderr: ${stderr}`);
                        console.log("File converted to .wav successfully!");
                        console.log("==================================================");
                        return;
                    }
                    // console.log(`stdout: ${stdout}`);
                    console.log("File converted to .wav successfully!");
                    console.log("==================================================");
                });
            });
            
            src.on('error', function(err) { res.json('Something went wrong!'); });
        }
        else{
            res.send(
                {
                    "status": "error",
                    "msg": "Could not send file, session is not valid.",
                    "data": {}
                }
            );
        }
    });

}