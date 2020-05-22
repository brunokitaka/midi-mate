  /* Connection singleton. */
function model(connection) {
	this._connection = connection;
}

/**
 * USER WEB AUTH:
 * Inserts new user data.
 */
model.prototype.insertUser = function (user, callback) {
    this._connection.query(
        'INSERT INTO user (userName, userEmail, userPassword) VALUES (' +
        '\'' + user.userName     + '\', ' +
        '\'' + user.userEmail    + '\', ' +
        '\'' + user.userPassword + '\')',
        callback
    );
}

/**
 * USER WEB AUTH:
 * Updates user data.
 */
model.prototype.updateUser = function (user, callback) {
    this._connection.query(
        'UPDATE user SET ' +
        'userName     = \'' + user.userName     + '\', ' +
        'userEmail    = \'' + user.userEmail    + '\', ' +
        'userPassword = \'' + user.userPassword + '\' ' +
        'WHERE idUser = ' + user.idUser,
        callback
    );
}

module.exports = function () {
	return model;
};