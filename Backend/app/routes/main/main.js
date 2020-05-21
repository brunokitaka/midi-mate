/**
 * MODULES
 */
const { check, validationResult } = require('express-validator'); /* Request data validator. */


module.exports = function (app) {
    
    /**
     * INDEX:
     * Returns index page.
     */
    app.get('/', function (req, res) {
        res.render("./main/index");
        return;
    });

    /**
     * HOME:
     * Returns user's home page if session is valid.
     */
    app.get('/home', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.main.login.isValid;

        /* Checks route permission. */
        if (req.session.token != undefined       && 
            isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)
        ) {
            res.render("./main/home");
            return;
        }
        /* If session is not valid, retuns login page. */
        else{
            res.redirect("/login");
            return;
        }
    });


    /**
     * EDIT PASSWORD:
     * If session is valid, returns change password page.
     */
    app.get('/editPassword', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.main.login.isValid;

        /* Checks route permission. */
        if (req.session.token != undefined       && 
            isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)
        ) {
            res.render("./common/editPassword");
            return;
        }
        /* If session is not valid, retuns login page. */
        else{
            res.redirect("/login");
            return;
        }
    });


    /**
     * UPDATE PASSWORD:
     * If session is valid, sends new password information to database.
     */
    app.post(
        '/updatePassword', 
        [
            check('oldPassword', 'Invalid current password!').not().isEmpty().escape().isString().isLength({ min: 8 }),
            check('newPassword', 'Invalid new password!').not().isEmpty().escape().isString().isLength({ min: 8 })
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
            /* Sends data for database, and creates new valid session. */
            app.app.controllers.web.main.password.updatePassword(app, req, res);
        }
    });

    
    /**
     * GET PERMISSIONS:
     * If session is valid, returns user permissions and profile.
     */
    app.get('/getPermissions', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.main.login.isValid;
        
        /* Checks route permission. */
        if (
            req.session.token != undefined && 
            isValid(req.session.email + req.session.profile + req.session.idAccount, req.session.token)
        ) {
            /* Permissions list. */
            let permissions = [];

            /* Populates permission list. */
            req.session.permissions.forEach(element => {
                if(element.icon != null && element.icon != ""){
                    permissions.push(element);
                }
            });

            /* Freezes object, making it unalterable. */
	        Object.freeze(permissions);

            /* Sends permissions list and profile. */
            res.send({
                status: "success",
                msg: "Permissões recuperadas com sucesso!",
                data: {permissions: permissions, profile: req.session.profile}
            });
            return;
        }
        else{
            res.send({status: "error", msg: "Access denied!"});
            return;
        }
    });

}