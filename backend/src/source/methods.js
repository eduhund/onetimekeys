const generate = require("./generate/generate");

const METHODS = [
	{
		name: "generate",
		type: "get",
		exec: generate,
	},
];

module.exports = METHODS;
