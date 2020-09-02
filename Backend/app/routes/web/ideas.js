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
var zipFolder = require('zip-folder');

module.exports = function (app) {

    /**
     * CREATE IDEA:
     * Returns create idea page.
     */
    app.get('/createIdea', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.login.isValid;

        /* Checks route permission. */
        if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token)) {
            res.render("./ideas/createIdea");
        }
        /* If session is not valid, retuns login page. */
        else {
            res.render("./user/login")
            return;
        }
    });

    /**
     * INSERT IDEA:
     * Receives new idea data and MIDI file.
     */
    app.post('/insertIdeaWeb', upload.single("midi"), function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.login.isValid;

        /* Checks route permission. */
        if (
            req.session.token != undefined &&
            isValid(req.session.email + req.session.idUser.toString(), req.session.token)
        ) {
            console.log("==================================================");
            console.log("Received new idea and MIDI file " + req.file.originalname + " from user " + req.session.email);

            let fileName = req.file.originalname;
            // let savePath = 'uploads/midi/' + req.session.idUser + req.file.originalname;
            let savePath = 'uploads/midi/' + req.session.idUser + "-" + req.body.ideaName + ".mid";
            let src = fs.createReadStream(req.file.path);
            let dest = fs.createWriteStream(savePath);

            src.pipe(dest);

            src.on('end', function () {
                fs.unlinkSync(req.file.path);

                console.log("File saved!");

                fileName = req.session.idUser + "-" + req.body.ideaName;

                let ideaInfo = {
                    "name": req.body.ideaName,
                    "path": fileName,
                    "idUser": req.session.idUser
                };

                app.app.controllers.web.ideas.insertIdeaWeb(app, req, res, ideaInfo, savePath);
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
            app.app.controllers.web.ideas.selectUserIdeas(app, req, res);
        }
        /* If session is not valid. */
        else {
            res.send({
                status: "error",
                msg: "Access denied!"
            });
            return;
        }
    });

    /**
     * DOWNLOAD USER FILE:
     * Sends file to be downloaded.
     */
    app.get('/downLoadUserFile', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.login.isValid;

        /* Checks route permission. */
        if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token)) {
            // app.app.controllers.web.ideas.downLoadUserFile(app, req, res);
            let path = req.query.file;
            let type = req.query.type;
            let idIdea = req.query.idIdea;

            // console.log(path);
            // console.log(type);

            switch (type) {
                /* Original Recording: .wav */
                case "0":
                    res.download("uploads/wav/" + path + ".wav");
                    break;
                    /* Original MIDI: .midi */
                case "1":
                    res.download("uploads/midi/" + path + ".mid");
                    break;
                    /* Suggestions: .zip */
                case "2":                   
                    zipFolder("uploads/suggestion/" + idIdea + "/", "uploads/suggestion/" + idIdea + ".zip", function(err) {
                        if(err) {
                            console.log("==================================================");
                            console.log("DateTime: " + Date(Date.now()).toString());
                            console.log("Email: " + req.session.email);
                            console.log("Controller: downLoadUserFile");
                            console.log("Msg: Error whiile zipping folder!");
                            console.log("Error: " + err);
                            console.log("==================================================\n");
                            res.send({
                                status: "error",
                                msg: "Error! Try again later..."
                            })
                        } else {
                            console.log('EXCELLENT');
                            res.on('finish', function() { fs.unlink("uploads/suggestion/" + idIdea + ".zip")});
                            res.download("uploads/suggestion/" + idIdea + ".zip");
                        }
                    });

                    // res.download("uploads/suggestion/" + idIdea + "/1.mid");
                    break;
                default:
                    res.send({
                        status: "error",
                        msg: "Invalid File!"
                    })
            }
        }
        /* If session is not valid. */
        else {
            res.send({
                status: "error",
                msg: "Access denied!"
            });
            return;
        }
    });

    /**
     * DELETE IDEA WEB:
     * Deletes user's record, idea and suggestions.
     */
    app.post('/deleteIdeaWeb',
        [
            check('idIdeaWeb', 'Invalid ID!').not().isEmpty().isNumeric(),
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
                    app.app.controllers.web.ideas.deleteIdeaWeb(app, req, res);
                }
            }
        });
}