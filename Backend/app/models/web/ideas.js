/* Connection singleton. */
function model(connection) {
	this._connection = connection;
}

/**
 * SELECT USER IDEAS:
 * Select all user's ideas.
 */
model.prototype.selectUserIdeas = function (idUser, callback) {
	this._connection.query("SELECT * FROM idea WHERE idUser = " + idUser, callback);
}


module.exports = function () {
	return model;
};