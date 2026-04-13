/**
 * Cliente HTTP para a API REST (mesma origem). Muralis.
 */
async function apiRequest(path, options = {}) {
	const headers = { Accept: "application/json", ...options.headers };
	if (options.body && !(options.body instanceof FormData)) {
		headers["Content-Type"] = "application/json";
	}
	const res = await fetch(path, { ...options, headers });
	const text = await res.text();
	let data = null;
	if (text) {
		try {
			data = JSON.parse(text);
		} catch {
			data = { message: text };
		}
	}
	if (!res.ok) {
		const err = new Error(data?.message || res.statusText || "Erro na requisição");
		err.status = res.status;
		err.body = data;
		throw err;
	}
	return data;
}

function formatarErroValidacao(body) {
	if (!body?.fieldErrors) return body?.message || "Erro de validação";
	return Object.entries(body.fieldErrors)
		.map(([k, v]) => `${k}: ${v}`)
		.join(" · ");
}
