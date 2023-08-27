const { log } = require("../logs/logs");
const { getToken } = require("../db/actions");

async function checkAPIToken(req, res, next) {
	const { authorization } = req.headers;

	if (!authorization) return next({ code: 10103 });

	try {
		const token = authorization.replace("Bearer ", "");
		const tokenData = await getToken(token);

		if (!tokenData) return next({ code: 10104 });

		const { organization } = tokenData;
		req.data = { org: organization };
		return next();
	} catch (e) {
		const err = { code: 20201, trace: e };
		next(err);
	}
}

module.exports = { checkAPIToken };
