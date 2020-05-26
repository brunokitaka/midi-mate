/**
 * MODULES
 */
const { check, validationResult } = require('express-validator'); /* Request data validator. */


module.exports = function (app) {

    /**
     * MOBILE LOGIN:
     * Logs in users in the app.
     */
    app.post(
        '/mobileLogin',
        [
            check('email', 'Check email input!').not().isEmpty().escape().isEmail(),
            check('password', 'Invalid password!').not().isEmpty().isLength({ min: 8, max: 32 })
        ],
    function (req, res) {
        /* Receives data validation errors, if any. */
        const errors = validationResult(req)
        
        /* If error, sends error message. */          
        if (!errors.isEmpty()) {
            res.send({status: "error", msg: errors.array()});
            return;
        }
        else {
            /* Sends data for database validation. */
            app.app.controllers.mobile.login.mobileLogin(app, req, res);
        }
    });

}