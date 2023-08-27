const fs = require("fs");

let keys = require("../../files/oneTimeKeys.json");

function write(keys) {
	fs.writeFileSync(
		require.resolve("../../files/oneTimeKeys.json"),
		JSON.stringify(keys)
	);
}

function oneTimeKeyMachine() {
	function checkKey(key) {
		try {
			const keyIndex = keys.findIndex((item) => item.key === key);
			if (!(keyIndex + 1)) {
				return false;
			}

			const now = Date.now();
			const { expiresAt } = keys[keyIndex];

			keys.splice(keyIndex, 1);
			write(keys);
			if (expiresAt < now) {
				return false;
			} else return true;
		} catch {
			throw new Error("Check OTK failed");
		}
	}

	function setKey(user) {
		if (!user.id) {
			throw new Error("User ID is undefined");
		}

		try {
			const newKey = Math.random().toString(36).substring(2);
			keys = keys.filter((item) => item.userId !== user.id);
			keys.push({
				key: newKey,
				userId: user.id,
				expiresAt: Date.now() + 120 * 60 * 60 * 1000,
			});
			write(keys);
			return newKey;
		} catch (e) {
			console.log(e);
			throw new Error("Set OTK failed");
		}
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
