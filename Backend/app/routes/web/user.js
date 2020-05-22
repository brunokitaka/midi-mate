/**
 * MODULES
 */
const { check, validationResult } = require('express-validator'); /* Request data validator. */


module.exports = function (app) {

    /**
     * HOME:
     * Returns user's home page if session is valid.
     */
    app.get('/home', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.login.isValid;

        /* Checks route permission. */
        if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token)) {
            res.render("./user/home");
            return;
        }
        /* If session is not valid, retuns login page. */
        else{
            res.redirect("/login");
            return;
        }
    });

    /**
     * CREATE USER:
     * Returns user creation page.
     */
    app.get('/createUser', function (req, res) {
        res.render('user/createUser');
        return;
    });


    /**
     * INSERT USER:
     * Sends new user data to database.
     */
    app.post('/insertUser', 
    [
        check('userName', 'Invalid name!').not().isEmpty().escape(),
        check('userEmail', 'Invalid email!').not().isEmpty().isEmail(), 
        check('userPassword', 'Invalid password!').not().isEmpty().isLength({ min: 8 }),
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
            app.app.controllers.web.user.insertUser(app, req, res);
        }
    });


    /**
     * EDIT USER:
     * Returns user edit page.
     */
    app.get('/editUser', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.login.isValid;

        /* Checks route permission. */
        if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token)) {
            res.render("./user/editUser");
            return;
        }
        /* If session is not valid, retuns login page. */
        else{
            res.render("./user/login");
            return;
        }
    });


    /**
     * UPDATE USER:
     * Sends updated user data to database.
     */
    app.post('/updateUser', 
        [
            check('userName', 'Invalid Name!').not().isEmpty().escape(),
            check('userEmail', 'Invalid email!').not().isEmpty().isEmail(), 
            check('userPassword', 'Invalid password!').not().isEmpty().isLength({ min: 8 })
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
            else {
                app.app.controllers.web.user.updateUser(app, req, res);
            }
        }
        /* If session is not valid, retuns login page. */
        else {
            res.send({status: "error", msg: "Access denied!"});
            return;
        }
    });
}

// /**
//      * EDIT PASSWORD:
//      * If session is valid, returns change password page.
//      */
//     app.get('/editPassword', function (req, res) {
//         /* Gets isValid() instance. */
//         const isValid = app.app.controllers.web.main.login.isValid;

//         /* Checks route permission. */
//         if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token))
//         {
//             res.render("./common/editPassword");
//             return;
//         }
//         /* If session is not valid, retuns login page. */
//         else{
//             res.redirect("/login");
//             return;
//         }
//     });


//     /**
//      * UPDATE PASSWORD:
//      * If session is valid, sends new password information to database.
//      */
//     app.post(
//         '/updatePassword', 
//         [
//             check('oldPassword', 'Invalid current password!').not().isEmpty().escape().isString().isLength({ min: 8 }),
//             check('newPassword', 'Invalid new password!').not().isEmpty().escape().isString().isLength({ min: 8 })
//         ], 
//     function (req, res) {
//         /* Receives data validation errors, if any. */
//         const errors = validationResult(req);

//         /* If error, sends error message. */          
//         if (!errors.isEmpty()) {
//             res.send({status: "error", msg: errors.array()});
//             return;
//         }
//         else {
//             /* Sends data for database, and creates new valid session. */
//             app.app.controllers.web.main.password.updatePassword(app, req, res);
//         }
//     });