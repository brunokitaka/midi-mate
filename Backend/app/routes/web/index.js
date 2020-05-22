/**
 * MODULES
 */


module.exports = function (app) {
    
    /**
     * INDEX:
     * Returns index page.
     */
    app.get('/', function (req, res) {
        res.render("./index/index");
        return;
    });
}