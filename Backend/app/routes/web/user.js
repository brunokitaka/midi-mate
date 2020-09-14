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
        check('userSc', 'Invalid link to SoundCloud!').not().isEmpty(),
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
     * UPDATE USER WITH PASSWORD:
     * Sends updated user data to database.
     */
    app.post('/updateUserWithPassword', 
        [
            check('userName', 'Invalid Name!').not().isEmpty().escape(),
            check('userEmail', 'Invalid email!').not().isEmpty().isEmail(), 
            check('userPassword', 'Invalid password!').not().isEmpty().isLength({ min: 8 }),
            check('userSc', 'Invalid link to SoundCloud!').not().isEmpty(),
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
                app.app.controllers.web.user.updateUserWithPassword(app, req, res);
            }
        }
        /* If session is not valid, retuns login page. */
        else {
            res.send({status: "error", msg: "Access denied!"});
            return;
        }
    });

    /**
     * UPDATE USER WITHOUT PASSWORD:
     * Sends updated user data to database.
     */
    app.post('/updateUserWithoutPassword', 
        [
            check('userName', 'Invalid Name!').not().isEmpty().escape(),
            check('userEmail', 'Invalid email!').not().isEmpty().isEmail(),
            check('userSc', 'Invalid link to SoundCloud!').not().isEmpty(),
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
                app.app.controllers.web.user.updateUserWithoutPassword(app, req, res);
            }
        }
        /* If session is not valid, retuns login page. */
        else {
            res.send({status: "error", msg: "Access denied!"});
            return;
        }
    });


    /**
     * GET USER INFO:
     * Returns user info.
     */
    app.get('/getUserInfo', function (req, res) {
        /* Gets isValid() instance. */
        const isValid = app.app.controllers.web.login.isValid;

        /* Checks route permission. */
        if (req.session.token != undefined && isValid(req.session.email + req.session.idUser.toString(), req.session.token)) {
            app.app.controllers.web.user.getUserInfo(app, req, res);
        }
        /* If session is not valid, retuns login page. */
        else{
            res.render("./user/login");
            return;
        }
    });
}