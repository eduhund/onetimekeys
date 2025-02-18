const setKey = require("./setKey/setKey");
const checkKey = require("./checkKey/checkKey");

const METHODS = [
	{
		name: "setKey",
		type: "post",
		requiredParams: ["user"],
		exec: setKey,
	},
	{
		name: "checkKey",
		type: "get",
		requiredParams: ["key"],
		exec: checkKey,
	},
];

module.exports = METHODS;
