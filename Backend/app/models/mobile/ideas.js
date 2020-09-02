/* Connection singleton. */
function model(connection) {
	this._connection = connection;
}

/**
 * INSERT IDEA:
 * Inserts new idea.
 */
model.prototype.insertIdea = function (idea, callback) {
	this._connection.query(
        'INSERT INTO idea(appId, ideaName, ideaPath, idUser, ideaSource) VALUES ' + 
        `(${idea.id}, "${idea.name}", "${idea.path}", ${idea.idUser}, 1)`, 
        callback
    );
}

/**
 * DELETE IDEA:
 * Deletes idea.
 */
model.prototype.deleteIdea = function (idea, callback) {
	this._connection.query('DELETE FROM idea WHERE appId = ' + idea.idIdeaApp + " AND idUser = " + idea.idUser, callback);
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