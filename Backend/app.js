/**
 * MODULES
 */
const app = require('./config/server'); /* Import server configs. */


const port = process.env.PORT_SERVER; /* Port to listen. */

/**
 * SERVER START
 */ 

app.listen(port, function () {
	console.log('Server ON!');
});
/*============================================================================*/

