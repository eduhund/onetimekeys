const { generateKey } = require("keycrafter");

function oneTimeKeyMachine() {
	const keys = [];
	const burnQueue = {}

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
				console.log(`OTK (${key}) was removed from the org ${orgId}`)
			}

			return true;
		} catch {
			throw new Error("Check OTK failed");
		}
	}

	function setKey(data, orgId) {
		const { userId, type = "digit", length = 4, life = 3600, isReusable = false } = data;
		if (!userId || !orgId) {
			throw new Error("User ID is undefined");
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

			return newKey;
		} catch (e) {
			console.log(e);
			throw new Error("Set OTK failed");
		}
	}

	function addToBurnQueue({key, userId, orgId, created}, timeout) {
		console.log(`OTK (${key}) for org ${orgId} was added to the burn queue`)
		const queueItem = setTimeout(() => {
			const index = keys.findIndex((item) => item.orgId === orgId && item.key === key )
			if (index !== -1) {
				keys.splice(index, 1)
				console.log(`OTK (${key}) was removed from the org ${orgId}`)
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
