const { log } = console;
const express = require("express");
const OTK = require("../../core/otkMachine");
const { SERVER_PORT = 443 } = process.env;

const app = express();

app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));

const api = express.Router();
const service = express.Router();

app.use("/api", api);
app.use("/service", service);

api.post("/setKey", (req, res) => {
	const user = req.body;
	const key = OTK.setKey(user);
	if (key) {
		log(`New OTK (${key}) set to user ${user.id}`);
		res.status(200).send({ OK: true, data: { key } });
	} else {
		log(`OTK not generated to user ${user.id}`);
		res.status(400).send({ OK: false, error: `OTK not generated to user` });
	}
});

api.get("/checkKey", (req, res) => {
	const { key } = req.query;
	log("New OTK use: ", key);
	const result = OTK.checkKey(key);
	if (result) {
		res.status(200).send({ OK: true });
	} else {
		log("Error with key: ", key);
		res.status(400).send({ OK: false, error: "OTK is invalid" });
	}
});

api.get("/getKeysList", (req, res) => {
	const { authorization } = req.headers;
	log("New OTK list check");
	if (authorization !== ADMIN_VERIFY) {
		res.sendStatus(401);
	} else {
		const result = OTK.checkList();
		res.status(200).send(result);
	}
});

async function start() {
	return new Promise((resolve, reject) => {
		app.listen(SERVER_PORT, (err) => {
			if (err) {
				return reject(err);
			}
			log(`OTK server starts on port ${SERVER_PORT}`);
			return resolve();
		});
	});
}

module.exports = { start };
