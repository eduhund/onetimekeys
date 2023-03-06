const fs = require("fs");

function oneTimeKeyMachine() {
  const keys = require("./oneTimeKeys.json");
  function checkKey(key) {
    if (Object.keys(keys).includes(key)) {
      delete keys[key];
      fs.writeFileSync(
        require.resolve("./oneTimeKeys.json"),
        JSON.stringify(keys)
      );
      return true;
    } else {
      return false;
    }
  }

  function setKey(user) {
    if (!user.id) {
      return undefined;
    }
    const newKey = Math.random().toString(36).substring(2);
    keys[newKey] = {
      id: user.id,
      expiresAt: Date.now() + 120 * 60 * 60 * 1000,
    };
    fs.writeFileSync(
      require.resolve("./oneTimeKeys.json"),
      JSON.stringify(keys)
    );
    return newKey;
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

const oneTimeKeys = oneTimeKeyMachine();

module.exports.oneTimeKeyMachine = oneTimeKeyMachine;
module.exports.oneTimeKeys = oneTimeKeys;
