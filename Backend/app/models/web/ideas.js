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

/**
 * INSERT IDEA:
 * Inserts new idea.
 */
model.prototype.insertIdea = function (idea, callback) {
	this._connection.query(
        'INSERT INTO idea(ideaName, ideaPath, idUser, ideaSource) VALUES ' + 
        `("${idea.name}", "${idea.path}", ${idea.idUser}, 2)`, 
        callback
    );
}

/**
 * DELETE IDEA:
 * Deletes idea.
 */
model.prototype.deleteIdea = function (idea, callback) {
	this._connection.query('DELETE FROM idea WHERE idIdea = ' + idea.idIdeaWeb + " AND idUser = " + idea.idUser, callback);
}


module.exports = function () {
	return model;
};