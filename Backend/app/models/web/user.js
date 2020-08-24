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
        'INSERT INTO user (userName, userEmail, userPassword) VALUES (' +
        '\'' + user.userName     + '\', ' +
        '\'' + user.userEmail    + '\', ' +
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

module.exports = function () {
	return model;
};