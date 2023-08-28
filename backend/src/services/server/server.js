const { log } = require("../logs/logs");
const express = require("express");
const cors = require("cors");
const API = require("../../API/methods");
const SOURCE = require("../../source/methods");
const { checkAPIToken } = require("./security");
const { responseHandler, pathHandler } = require("./responses");
const { SERVER_PORT = 443 } = process.env;

const app = express();

app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));

const api = express.Router();
const source = express.Router();

app.use("/api", api);
app.use("/source", source);

api.use(
	cors({
		origin: "*",
	})
);
source.use(
	cors({
		origin: "https://api.eduhund.com",
	})
);

api.use(checkAPIToken);

for (const { name, type, exec } of API) {
	api[type]("/" + name, exec);
}

for (const { name, type, exec } of SOURCE) {
	source[type]("/" + name, exec);
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
