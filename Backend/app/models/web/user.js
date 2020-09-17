  /* Connection singleton. */
function model(connection) {
	this._connection = connection;
}

/**
 * INSERT USER:
 * Inserts new user data.
 */
model.prototype.insertUser = function (user, callback) {
    this._connection.query(
        'INSERT INTO user (userName, userEmail, userSc, userPassword) VALUES (' +
        '\'' + user.userName     + '\', ' +
        '\'' + user.userEmail    + '\', ' +
        '\'' + user.userSc       + '\', ' +
        '\'' + user.userPassword + '\')',
        callback
    );
}

/**
 * UPDATE USER WITH PASSWORD:
 * Updates user data.
 */
model.prototype.updateUserWithPassword = function (user, callback) {
    this._connection.query(
        'UPDATE user SET ' +
        'userName     = \'' + user.userName     + '\', ' +
        'userEmail    = \'' + user.userEmail    + '\', ' +
        'userSC       = \'' + user.userSc    + '\', ' +
        'userPassword = \'' + user.userPassword + '\' ' +
        'WHERE idUser = ' + user.idUser,
        callback
    );
}

/**
 * UPDATE USER WITHOUT PASSWORD:
 * Updates user data.
 */
model.prototype.updateUserWithoutPassword = function (user, callback) {
    this._connection.query(
        'UPDATE user SET ' +
        'userName     = \'' + user.userName     + '\', ' +
        'userEmail    = \'' + user.userEmail    + '\' ' +
        'userSc       = \'' + user.userSc       + '\' ' +
        'WHERE idUser = ' + user.idUser,
        callback
    );
}

/**
 * GET USER INFO:
 * Selects user data.
 */
model.prototype.getUserInfo = function (user, callback) {
    this._connection.query('SELECT * FROM user WHERE idUser = ' + user, callback);
}

/**
 * UPDATE CLUSTERS:
 * Updates all user's clusters.
 */
model.prototype.updateClusters = function (user, callback) {
    console.log("CALLING PROCEDURE");
    this._connection.query("CALL CLUSTERUSER()",callback);
}

/**
 * GET ALL IDS:
 * Selects all user's ids.
 */
model.prototype.getAllIds = function (callback) {
    this._connection.query("SELECT idUser FROM user",callback);
}

/**
 * GET RECOMMENDATIONS:
 * Get user's recommendations.
 */
model.prototype.getRecommendations = function (user, cluster, callback) {
    this._connection.query("SELECT * from user WHERE userCluster = " + cluster + " AND idUser != " + user, callback);
}

module.exports = function () {
	return model;
};