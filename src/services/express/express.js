const { log } = console;
const express = require("express");

const app = express();
const { SERVER_PORT, ADMIN_VERIFY } = process.env;

app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));

const OTK = require("../../core/otkMachine");

//Admin API. Генерация одноразового кода для сброса пароля.
app.post("/setKey", (req, res) => {
	const user = req.body;
	log("New OTK set: ", user);
	const key = OTK.setKey(user);
	if (key) {
		res.status(200).send({ OK: true, data: key });
	} else {
		res.status(400).send({ OK: false, error: "OTK not generated" });
	}
});

//Admin API. Проверка валидности одноразового кода.
app.get("/checkKey", (req, res) => {
	const { key } = req.query;
	log("New OTK use: ", key);
	const result = OTK.checkKey(key);
	res.status(200).send(result);
});

//Admin API. Просмотр списка активных одноразовых ключей.
app.get("/getKeysList", (req, res) => {
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