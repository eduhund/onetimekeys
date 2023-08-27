const { log } = console;
const OTK = require("../../core/otkMachine");

function checkKey(req, res) {
	const { key } = req.query;
	log("New OTK use: ", key);
	const result = OTK.checkKey(key);
	if (result) {
		res.status(200).send({ OK: true });
	} else {
		log("Error with key: ", key);
		res.status(400).send({ OK: false, error: "OTK is invalid" });
	}
}

module.exports = checkKey;
