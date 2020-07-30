/**
 * MODULES
 */
const { check, validationResult } = require('express-validator'); /* Request data validator. */

module.exports = function (app) {
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

    // /**
    //  * IDEA PAGE:
    //  * Idea info page.
    //  */
    // app.get('/idea', function (req, res) {
    //     /* Gets isValid() instance. */
    //     const isValid = app.app.controllers.web.login.isValid;

    //     /* Checks route permission. */
    //     if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token)) {
    //         res.render("./ideas/idea")
    //     }
    //     /* If session is not valid. */
    //     else {
    //         res.send({status: "error", msg: "Access denied!"});
    //         return;
    //     }
    // });

    /**
     * DOWNLOAD USER FILE:
     * Sends file to be downloaded.
     */
    app.get('/downLoadUserFile', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.login.isValid;

        /* Checks route permission. */
        if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token)) {
            app.app.controllers.web.ideas.downLoadUserFile(app, req, res);
        }
        /* If session is not valid. */
        else {
            res.send({status: "error", msg: "Access denied!"});
            return;
        }
    });
}