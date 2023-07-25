require("dotenv").config();
const { log } = console;

const server = require("./src/services/express/express");

async function run() {
	await server.start();
	log("All systems is running. Let's rock!");
}

run();
