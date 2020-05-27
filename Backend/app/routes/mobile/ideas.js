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

        console.log("Received file" + req.file.originalname);

        var src = fs.createReadStream(req.file.path);
        var dest = fs.createWriteStream('uploads/' + req.file.originalname);

        src.pipe(dest);

        src.on('end', function() {
            fs.unlinkSync(req.file.path);
            res.json('OK: received ' + req.file.originalname);
        });
        
        src.on('error', function(err) { res.json('Something went wrong!'); });
    });

}