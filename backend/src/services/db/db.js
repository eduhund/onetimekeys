const { MongoClient } = require("mongodb");
const { log } = require("../logs/logs");

const { DB_URL, DB_NAME } = process.env;

const mongoClient = new MongoClient(DB_URL);

function getCollection(name) {
	return mongoClient.db(DB_NAME).collection(name);
}

async function connect() {
	await mongoClient.connect();
	log.info("Connected to database successfully");
}

module.exports = {
	connect,
	getCollection,
};
