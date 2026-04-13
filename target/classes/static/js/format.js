function formatarCpfExibicao(cpf) {
	if (!cpf) return "";
	const d = String(cpf).replace(/\D/g, "");
	if (d.length !== 11) return cpf;
	return d.slice(0, 3) + "." + d.slice(3, 6) + "." + d.slice(6, 9) + "-" + d.slice(9);
}

function formatarDataBR(iso) {
	if (!iso) return "";
	const parts = iso.split("-");
	if (parts.length !== 3) return iso;
	return parts[2] + "/" + parts[1] + "/" + parts[0];
}
