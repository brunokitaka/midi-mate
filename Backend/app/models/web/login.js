/* Connection singleton. */
function model(connection) {
	this._connection = connection;
}

/**
 * USER WEB AUTH:
 * Checks if user exists.
 */
model.prototype.userWebAuth = function (login, callback) {
	this._connection.query('SELECT * FROM user WHERE userEmail = \'' + login.userEmail + '\'', callback);
}


module.exports = function () {
	return model;
};