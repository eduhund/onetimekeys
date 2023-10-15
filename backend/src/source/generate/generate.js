const { generateKey } = require("keycrafter");
const { log } = require("../../services/logs/logs");

function generate(req, res) {
	try {
		const { type, length } = req.query
		const key = generateKey({type, length: Number(length)});
		res.status(200).send({ OK: true, data: { key } });
	} catch (e) {
		console.log(e)
	}
}

module.exports = generate;
