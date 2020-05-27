/**
 * MODULES
 */
const { check, validationResult } = require('express-validator'); /* Request data validator. */
var multer  = require('multer')
var fs = require('fs');
var upload = multer({ dest: 'uploads/' })


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
            console.log("Received file " + req.file.originalname + " from user " + req.session.email);

            var src = fs.createReadStream(req.file.path);
            var dest = fs.createWriteStream('uploads/' + req.session.idUser + "-" + req.file.originalname);

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