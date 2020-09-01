/**
 * MODULES
 */
const { check, validationResult } = require('express-validator'); /* Request data validator. */
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
    app.post('/insertIdea', upload.single("record"), function (req, res) {
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
            let savePath = 'uploads/midi/' + req.session.idUser + req.ideaName;
            let src = fs.createReadStream(req.file.path);
            let dest = fs.createWriteStream(savePath);

            src.pipe(dest);
            
            src.on('end', function () {
                fs.unlinkSync(req.file.path);

                console.log("File saved!");

                fileName = req.session.idUser + "-" + req.ideaName;

                let ideaInfo = {
                    "name": req.ideaName,
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
            res.send({status: "error", msg: "Access denied!"});
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

            console.log(path);
            console.log(type);

            switch(type){
                /* Original Recording: .wav */
                case "0":
                    res.download("uploads/wav/" + path + ".wav");    
                    break;
                /* Original MIDI: .midi */
                case "1":
                    res.download("uploads/midi/" + path + ".mid");
                    break;
                /* Suggestion 1: .midi */
                case "2":
                    res.download("uploads/suggestion/" + idIdea + "/1.mid");
                    break;
                /* Suggestion 2: .midi */
                case "3":
                    res.download("uploads/suggestion/" + idIdea + "/2.mid");
                    break;
                /* Suggestion 3: .midi */
                case "4":
                    res.download("uploads/suggestion/" + idIdea + "/3.mid");
                    break;
                default:
                    res.send({status: "error", msg: "Invalid File!"})
            }
        }
        /* If session is not valid. */
        else {
            res.send({status: "error", msg: "Access denied!"});
            return;
        }
    });
}