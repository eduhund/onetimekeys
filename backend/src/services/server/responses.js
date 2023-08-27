const { log } = require("../logs/logs");

const ERRORS = [
	{
		code: -1,
		type: "other_error",
	},
	{
		code: 10001,
		type: "invalid_request",
		description: "Invalid path",
	},
	{
		code: 10002,
		type: "invalid_request",
		description: "Missing required params",
	},
	{
		code: 10101,
		type: "invalid_credentials",
		description: "User didn't found",
	},
	{
		code: 10102,
		type: "invalid_credentials",
		description: "Invalid password",
	},
	{
		code: 10103,
		type: "invalid_credentials",
		description: "Empty authorization header",
	},
	{
		code: 10104,
		type: "invalid_credentials",
		description: "API token is invalid",
	},
	{
		code: 20101,
		type: "validate_failure",
		description: "Error request params validate",
	},
	{
		code: 20201,
		type: "internal_failure",
		description: "Error in check API token process",
	},
];

function responseGenerator(code, data = {}) {
	if (code === 0) {
		return { OK: true, data };
	} else {
		const error = ERRORS.find((error) => error.code === code) || -1;
		return { OK: false, error };
	}
}

function responseHandler(message, req, res, next) {
	const { code, content, trace } = message;
	const { data } = req;
	if (!code) {
		log.debug({ input: data, output: message });
		res.status(200).send(responseGenerator(0, content));
		return;
	}
	const error = responseGenerator(code || -1);
	if (code > 10000 && code < 20000) {
		log.warn({ input: data, output: error });
		res.status(400).send(error);
		return;
	} else {
		log.debug(trace);
		log.error({ input: data, output: error });
		res.status(500).send(error);
		return;
	}
}

function pathHandler(req, res, next) {
	res.status(404);
	res.send(responseGenerator(10001));
}

module.exports = { responseHandler, pathHandler };
