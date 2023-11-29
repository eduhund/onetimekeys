const { log } = require("../services/logs/logs");
const { generateKey } = require("keycrafter");
const { readFile, writeFile } = require("../services/fs/fs")

function oneTimeKeyMachine() {
	const burnQueue = {}
	const keys = readFromDump()
	

	function readFromDump() {
		const now = Date.now()
		const initKeys = readFile("/files/", "otk.json",) || [];
		log.debug("Init previous keys:", initKeys.length)
		const filtered = initKeys.filter((key) => key.expiresAt > now)
		for (const key of filtered) {
			const timeout = key.expiresAt - now 
			addToBurnQueue(key, timeout > 0 ? timeout : 0)
		}

		writeFile("/files/", "otk.json", filtered)

		return filtered
	}

	function writeToDump() {
		writeFile("/files/", "otk.json", keys)
	}

	function checkKey(key) {
		try {
			const keyIndex = keys.findIndex((item) => item.key === key);
			if (!(keyIndex + 1)) {
				return false;
			}

			const { userId, orgId, created, isReusable } = keys[keyIndex];

			if (!isReusable) {
				keys.splice(keyIndex, 1)
				clearTimeout(burnQueue[userId+orgId+created])
				writeToDump()
				log.debug(`OTK (${key}) was removed from the org ${orgId}`)
			}

			return true;
		} catch {
			throw new Error("Check OTK failed");
		}
	}

	function setKey(data, orgId) {
		const { userId, type = "digit", length = 4, life = 3600, isReusable = false } = data;
		if (!userId || !orgId) {
			throw new Error("No UserID or OrgID");
		}

		const timeout = life * 1000

		try {
			const newKey = generateKey({ type, length });
			//keys = keys.filter((item) => item.userId !== user.id);
			const now = Date.now()
			const key = {
				key: newKey,
				userId,
				orgId,
				isReusable,
				created: now,
				expiresAt: now + timeout,
			}
			keys.push(key);
			addToBurnQueue(key, timeout)
			writeToDump()

			return newKey;
		} catch (e) {
			log.error(e);
			throw new Error("Set OTK failed");
		}
	}

	function addToBurnQueue({key, userId, orgId, created}, timeout) {
		log.debug(`OTK (${key}) for org ${orgId} was added to the burn queue`)
		const queueItem = setTimeout(() => {
			const index = keys.findIndex((item) => item.orgId === orgId && item.key === key )
			if (index !== -1) {
				keys.splice(index, 1)
				writeToDump()
				log.debug(`OTK (${key}) was removed from the org ${orgId}`)
			}
		}, timeout)

		burnQueue[userId+orgId+created] = queueItem
	}

	function checkList() {
		return keys;
	}

	return {
		checkKey,
		setKey,
		checkList,
	};
}

const OTK = oneTimeKeyMachine();

module.exports = OTK;
