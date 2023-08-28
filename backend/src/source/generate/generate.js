const { generateKey } = require("keycrafter");
const { log } = require("../../services/logs/logs");

function generate(req, res) {
	try {
		const key = generateKey();
		res.status(200).send({ OK: true, data: { key } });
	} catch (e) {}
}

module.exports = generate;
