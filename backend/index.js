require("dotenv").config();
const { log } = require("./src/services/logs/logs");

const server = require("./src/services/server/server");
const db = require("./src/services/db/db");

async function run() {
	await server.start();
	await db.connect();
	log.info("All systems is running. Let's rock!");
}

run();
