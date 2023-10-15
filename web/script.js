const userKeyType = localStorage.getItem("randomKeyType") || "digit";
const userKeyLength = localStorage.getItem("randomKeyLength") || 4;

const range = document.querySelector("input[type=range]");
const number = document.querySelector("input[type=number]")
const radio = document.querySelectorAll("input[type=radio]")

range.value = userKeyLength
number.value = userKeyLength
document.querySelector(`input[name=type][value=${userKeyType}]`).checked = true

function symbolLimit() {
	let limit = 16

	function changeLimit(type) {
		limit = type === "digit" ? 16 : 32
		return limit
	}

	return {limit, changeLimit}
}

const limit = symbolLimit()

range.addEventListener("input",(e)=>{
	number.value = e.target.value;
})

number.addEventListener("input",(e)=>{
	if (e.target.value === "") {
		range.value = 4;
	} else {
		range.value = e.target.value;
	}
})

range.addEventListener("change",(e)=>{
	generate({length: e.target.value})
})

number.addEventListener("change",(e)=>{
	if (e.target.value === "" || e.target.value < 4) {
		number.value = 4;
		range.value = 4;
	}

	if (e.target.value > limit.limit) {
		number.value = limit.limit;
		range.value = limit.limit;
	}

	generate({length: number.value})
})

radio.forEach((input) => {
	input.addEventListener("change",(e)=>{
		const {value} = e.target
		const maxSymbols = limit.changeLimit(value)
		number.setAttribute("max", maxSymbols)
		range.setAttribute("max", maxSymbols)
		if (number.value > maxSymbols) {
			number.value = maxSymbols
			range.value = maxSymbols
		}
		generate({type: value, length: number.value})
	})
})

async function generate({type, length}) {

	const userKeyType = localStorage.getItem("randomKeyType") || "digit";
	const userKeyLength = localStorage.getItem("randomKeyLength") || 4;

	if (type) {
		localStorage.setItem("randomKeyType", type)
	}

	if (length) {
		localStorage.setItem("randomKeyLength", length)
	}

	const resultType = type || userKeyType
	const resultLength = length || userKeyLength

	const { OK, data, error } = await fetch(
		`https://otk.eduhund.com/source/generate?type=${resultType}&length=${resultLength}`
	).then((response) => response.json());

	document.querySelector("#key").innerHTML = data?.key;
}

generate({type: userKeyType, length: userKeyLength});
