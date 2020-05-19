/**
 * MODULES
 */
const dotenv = require('dotenv'); /* .env reader.*/

/**
 * CONFIG
 */

/* Reads the .env configs. */
const result = dotenv.config();

/* Error check. */
if (result.error) {
  throw result.error;
}

/* Sets the configs to the application. */
const { parsed: envs } = result;

module.exports = envs;
/*============================================================================*/
