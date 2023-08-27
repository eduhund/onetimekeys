const { getOne } = require("../requests");

async function getToken(token) {
	return getOne("tokens", { query: { token } });
}

module.exports = getToken;
