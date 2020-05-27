/**
 * MODULES
 */
const { check, validationResult } = require('express-validator'); /* Request data validator. */


module.exports = function (app) {
   
   /**
    * LOGIN:
    * Logs in users with valid sessions, if not, returns login page.
    */
    app.get('/login', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.login.isValid;

        /* Checks route permission. */
        if (req.session.token != undefined       && 
            isValid(req.session.email + req.session.idUser, req.session.token)
        ) {
            res.render("./user/home");
            return;
        }
        else{
            res.render("./user/login");
            return;
        }
    });


    /**
     * USER WEB AUTH:
     * Sends login page data for validation, if correct, user will be logged in.
     */
    app.post(
        '/userWebAuth', 
        [
            check('userEmail', 'Check email input!').not().isEmpty().escape().isEmail(),
            check('userPassword', 'Invalid password!').not().isEmpty().isLength({ min: 8, max: 32 })
        ], 
    function (req, res) {
        /* Receives data validation errors, if any. */
        const errors = validationResult(req);

        /* If error, sends error message. */            
        if (!errors.isEmpty()) {
            res.send({status: "error", msg: errors.array()});
            return;
        }
        else {
            /* Sends data for database validation. */
            app.app.controllers.web.login.userWebAuth(app, req, res);
        }
    });

    /**
     * LOGOUT:
     * Kills current session.
     */
    app.get('/logout', function (req, res) {
        /* Calls controller that kill the session. */
        app.app.controllers.web.login.logout(app, req, res);
    });

}
