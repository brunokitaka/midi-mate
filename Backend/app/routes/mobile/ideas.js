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
            var savePath = 'uploads/raw/' + req.session.idUser + "-" + req.body.idIdea + "-" + req.file.originalname;
            var src = fs.createReadStream(req.file.path);
            var dest = fs.createWriteStream(savePath);

            src.pipe(dest);

            src.on('end', function() {
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
                
                var cmd = "ffmpeg -i " + savePath + " " + "uploads/wav/" + fileName + ".wav";
                console.log("Running: " + cmd);
                
                exec(cmd, (error, stdout, stderr) => {
                    if (error) {
                        console.log("Error while converting file!");
                        console.log(`error: ${error.message}`);
                        res.send(
                            {
                                "status": "error",
                                "msg": "Could not convert file.",
                                "data": {}
                            }
                        );
                        return;
                    }
                    // if (stderr) {
                    //     // console.log("Error while converting file!");
                    //     // console.log(`stderr: ${stderr}`);
                    // }
                    // console.log(`stdout: ${stdout}`);
                    console.log("File converted to .wav successfully!");
                    console.log("==================================================");

                    let ideaInfo = {
                        "id": req.body.idIdea,
                        "name": ideaName,
                        "path": fileName,
                        "idUser": req.session.idUser
                    };

                    app.app.controllers.mobile.ideas.insertIdea(app, req, res, ideaInfo);
                });
            });
            
            src.on('error', function(err) {
                res.send(
                    {
                        "status": "error",
                        "msg": "Could not save file.",
                        "data": {}
                    }
                ); 
            });
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
                res.send({status: "error", msg: errors.array()});
                return;
            }
            else{
                app.app.controllers.mobile.ideas.deleteIdea(app, req, res);
            }
        }
    });

    /**
     * LIST IDEAS:
     * Returns list ideas page.
     */
    app.get('/listIdeas', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.login.isValid;

        /* Checks route permission. */
        if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token)) {
            res.render("./ideas/listIdeas");
        }
        /* If session is not valid, retuns login page. */
        else {
            res.render("./user/login")
            return;
        }
    });

    /**
     * SELECT USER IDEAS:
     * Selects all user's ideas.
     */
    app.post('/selectUserIdeas', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.login.isValid;

        /* Checks route permission. */
        if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token)) {
            app.app.controllers.mobile.ideas.selectUserIdeas(app, req, res);
        }
        /* If session is not valid. */
        else {
            res.send({status: "error", msg: "Access denied!"});
            return;
        }
    });
}