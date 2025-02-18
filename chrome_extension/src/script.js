const range = document.querySelector("input[type=range]");
const number = document.querySelector("input[type=number]");
const radio = document.querySelectorAll("input[type=radio]");

function storeWorker() {
  const store = {
    randomKeyType: "digit",
    randomKeyLength: 4,
  };

  function get(storage) {
    return store[storage];
  }

  function setStorageValue(storage, value) {
    localStorage.setItem(storage, value);
    store[storage] = value;
    return value;
  }

  function start() {
    for (const [key, value] of Object.entries(store)) {
      const initValue = localStorage.getItem(key);
      if (initValue === null) {
        setStorageValue(key, value);
      } else {
        store[key] = initValue;
      }
    }
  }

  function update(storage, value) {
    if (!value) {
      return store[storage];
    } else if (store[storage] !== value) {
      return setStorageValue(storage, value);
    } else return value;
  }

  return { start, get, update };
}

function init() {
  store.start();
  const type = store.get("randomKeyType");
  const length = store.get("randomKeyLength");

  const maxSymbols = limit.changeLimit(type);

  number.setAttribute("max", maxSymbols);
  range.setAttribute("max", maxSymbols);

  range.value = length;
  number.value = length;
  document.querySelector(`input[name=type][value=${type}]`).checked = true;

  generate({ type, length });
}

function symbolLimit() {
  let limit = 16;

  function changeLimit(type) {
    limit = type === "digit" ? 16 : 32;
    return limit;
  }

  return { limit, changeLimit };
}

range.addEventListener("input", (e) => {
  number.value = e.target.value;
});

number.addEventListener("input", (e) => {
  if (e.target.value === "") {
    range.value = 4;
  } else {
    range.value = e.target.value;
  }
});

range.addEventListener("change", (e) => {
  generate({ length: e.target.value });
});

number.addEventListener("change", (e) => {
  if (e.target.value === "" || e.target.value < 4) {
    number.value = 4;
    range.value = 4;
  }

  if (e.target.value > limit.limit) {
    number.value = limit.limit;
    range.value = limit.limit;
  }

  generate({ length: number.value });
});

radio.forEach((input) => {
  input.addEventListener("change", (e) => {
    const { value } = e.target;
    const maxSymbols = limit.changeLimit(value);
    number.setAttribute("max", maxSymbols);
    range.setAttribute("max", maxSymbols);
    if (number.value > maxSymbols) {
      number.value = maxSymbols;
      range.value = maxSymbols;
    }
    generate({ type: value, length: number.value });
  });
});

async function generate({ type, length }) {
  const resultType = store.update("randomKeyType", type);
  const resultLength = store.update("randomKeyLength", length);

  const { OK, data, error } = await fetch(
    `https://otk.eduhund.com/source/generate?type=${resultType}&length=${resultLength}`
  ).then((response) => response.json());

  document.querySelector("#key").innerHTML = data?.key;
}

function copyCode(event) {
  const value = event.target.innerText;
  const key = document.querySelector("#key");
  const refreshButton = document.querySelector("#refreshButton");

  navigator.clipboard.writeText(value);
  key.onclick = undefined;
  key.innerText = "Copied!";
  key.style.cursor = "default";
  refreshButton.style.display = "none";

  setTimeout(() => {
    key.onclick = copyCode;
    key.innerText = value;
    key.style.cursor = "pointer";
    refreshButton.style.display = "block";
  }, 1000);
}

document.querySelector("#key").onclick = copyCode;
document.querySelector("#refreshButton").onclick = () => generate({});

const store = storeWorker();
const limit = symbolLimit();
init();
