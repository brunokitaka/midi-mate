/**
 * MODULES
 */
const {
    check,
    validationResult
} = require('express-validator');

module.exports = function (app) {

    /**
     * SEND CLUSTERS:
     * Receives and inserts all generated clusters.
     */
    app.post('/sendClusters', function (req, res) {
        app.app.controllers.web.clusters.sendClusters(app, req, res);
    });
}