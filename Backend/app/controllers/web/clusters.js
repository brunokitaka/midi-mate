const empty = require('is-empty');  /* Check if data's empty. */

/**
 * SEND CLUSTERS:
 * Inserts clusters into database.
 */
module.exports.sendClusters = function (app, req, res) {

    /* Database connection. */
	const connection = app.config.dbConnection();
    const model = new app.app.models.web.ideas(connection);
    
    let clusters = req.body.clusters;
    let query = "";

    clusters.forEach(element => {
        let path = element["Unnamed: 0"];
        path = path.split("/");
		let filename = path[8];
        filename = filename.split("-");
        let idUser = filename[0];
        let ideaName = filename[1];
        ideaName = ideaName.split(".")[0];
        query += "UPDATE idea SET ideaCluster = " + element.cluster + " WHERE idUser = " + idUser + " AND ideaName = \"" + ideaName + "\";";
    });

	model.insertClusters(query, function (error, result) {	

		/* Checks for error. */
		if (error) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.email);
			console.log("Controller: sendClusters");
			console.log("Msg: Error while inserting clusters!");
			console.log("Error(insertClusters): " + error);
			console.log("==================================================\n");
            return;
		} 
		/* Checks if database response is empty. */
		else if (empty(result)) {
			console.log("==================================================");
			console.log("DateTime: " + Date(Date.now()).toString());
			console.log("Email: " + req.session.email);
			console.log("Controller: sendClusters");
			console.log("Msg: Error while inserting clusters!");
			console.log("Error(insertClusters): Result is empty " + result.rows);
			console.log("==================================================\n");
            return;
		} else {

			console.log("==================================================");
			console.log("Clusters successfully inserted into DB!");
            console.log("==================================================\n");

            const userModel = new app.app.models.web.user(connection);

            userModel.updateClusters(function (error, result) {
				/* Checks for error. */
				if (error) {
					console.log("==================================================");
					console.log("DateTime: " + Date(Date.now()).toString());
					console.log("Email: " + req.session.email);
					console.log("Controller: sendClusters");
					console.log("Msg: Error while updating user clusters!");
					console.log("Error(updateClusters): " + error);
					console.log("==================================================\n");
					return;
				} 
				/* Checks if database response is empty. */
				else if (empty(result)) {
					console.log("==================================================");
					console.log("DateTime: " + Date(Date.now()).toString());
					console.log("Email: " + req.session.email);
					console.log("Controller: sendClusters");
					console.log("Msg: Error while updating user clusters!");
					console.log("Error(updateClusters): Result is empty " + result.rows);
					console.log("==================================================\n");
					return;
				} else {
					console.log("==================================================");
					console.log("Users clusters successfully updated!");
					console.log("==================================================\n");
				}
			});		
		}
	});
}