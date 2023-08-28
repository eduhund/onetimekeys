async function generate() {
	const { OK, data, error } = await fetch(
		"https://otk.eduhund.com/source/generate"
	).then((response) => response.json());

	document.querySelector("#key").innerHTML = data?.key;
}

generate();
