require("dotenv").config();
const { log } = console;

const server = require("./src/services/server/server");
const db = require("./src/services/db/db");

async function run() {
	await server.start();
	await db.connect();
	log("All systems is running. Let's rock!");
}

run();
