const { log } = console;
const OTK = require("../../core/otkMachine");

function setKey(req, res) {
	console.log(req.body)
	const { userId } = req.body;
	const { orgId } = req.data;
	const key = OTK.setKey(req.body, orgId);
	if (key) {
		log(`New OTK (${key}) set to user ${userId} and org ${orgId}`);
		res.status(200).send({ OK: true, data: { key } });
	} else {
		log(`OTK not generated to user ${user.id}`);
		res.status(400).send({ OK: false, error: `OTK not generated to user` });
	}
}

module.exports = setKey;
