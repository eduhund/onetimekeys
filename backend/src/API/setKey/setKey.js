const { log } = console;
const OTK = require("../../core/otkMachine");

function setKey(req, res) {
	const user = req.body;
	const { org } = req.data;
	const key = OTK.setKey(user, org);
	if (key) {
		log(`New OTK (${key}) set to user ${user.id} and org ${org}`);
		res.status(200).send({ OK: true, data: { key } });
	} else {
		log(`OTK not generated to user ${user.id}`);
		res.status(400).send({ OK: false, error: `OTK not generated to user` });
	}
}

module.exports = setKey;
