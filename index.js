require("dotenv").config();

const express = require("express");

const app = express();
const port = process.env.SERVER_PORT;

app.use(express.json());
app.use(require("body-parser").urlencoded({ extended: false }));

const OTK = require("./otkMachine");

//Admin API. Генерация одноразового кода для сброса пароля.
app.post("/set_otk", (req, res) => {
	const user = req.body;
	console.log("New OTK set: ", user);
	const key = OTK.setKey(user);
	if (key) {
		res.status(200).send({ OK: true, data: key });
	} else {
		res.status(400).send({ OK: false, error: "OTK not generated" });
	}
});

//Admin API. Проверка валидности одноразового кода.
app.get("/check_otk", (req, res) => {
	const { key } = req.query;
	console.log("New OTK use: ", key);
	const result = OTK.checkKey(key);
	res.status(200).send(result);
});

//Admin API. Просмотр списка активных одноразовых ключей.
app.get("/otk_list", (req, res) => {
	const { verify } = req.query;
	console.log("New OTK list check");
	if (verify !== process.env.ADMIN_VERIFY) {
		res.sendStatus(401);
	} else {
		const result = OTK.checkList();
		res.status(200).send(result);
	}
});

app.listen(port, () => {
	console.log(`OTK server starts on port ${port}`);
});
