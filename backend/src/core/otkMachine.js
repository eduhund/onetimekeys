const { generateKey } = require("keycrafter");

function oneTimeKeyMachine() {
	const keys = [];

	function checkKey(key) {
		try {
			const keyIndex = keys.findIndex((item) => item.key === key);
			if (!(keyIndex + 1)) {
				return false;
			}

			const now = Date.now();
			const { expiresAt } = keys[keyIndex];

			keys.splice(keyIndex, 1);
			if (expiresAt < now) {
				return false;
			} else return true;
		} catch {
			throw new Error("Check OTK failed");
		}
	}

	function setKey(user, org) {
		if (!user.id || !org) {
			throw new Error("User ID is undefined");
		}

		try {
			const newKey = generateKey({ type: "string", length: 8 });
			//keys = keys.filter((item) => item.userId !== user.id);
			keys.push({
				key: newKey,
				userId: user.id,
				org: org,
				expiresAt: Date.now() + 120 * 60 * 60 * 1000,
			});
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
