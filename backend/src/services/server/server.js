const { log } = require("../logs/logs");
const express = require("express");
const METHODS = require("../../API/methods");
const { checkAPIToken } = require("./security");
const { responseHandler, pathHandler } = require("./responses");
const { SERVER_PORT = 443 } = process.env;

const app = express();

app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));

const api = express.Router();
const service = express.Router();

app.use("/api", api);
app.use("/service", service);

api.use(checkAPIToken);

for (const { name, type, exec } of METHODS) {
	api[type]("/" + name, exec);
}

app.use(responseHandler);
app.use(pathHandler);

async function start() {
	return new Promise((resolve, reject) => {
		app.listen(SERVER_PORT, (err) => {
			if (err) {
				return reject(err);
			}
			log.info(`OTK server starts on port ${SERVER_PORT}`);
			return resolve();
		});
	});
}

module.exports = { start };
