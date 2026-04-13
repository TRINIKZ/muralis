(function () {
	const params = new URLSearchParams(window.location.search);
	const id = params.get("id");
	const titulo = document.getElementById("titulo");
	const msg = document.getElementById("msg");
	const form = document.getElementById("form");

	function showMsg(text, cls) {
		msg.innerHTML = text ? '<div class="alert ' + cls + '">' + text + "</div>" : "";
	}

	if (id) {
		titulo.textContent = "Editar cliente";
		apiRequest("/clientes/" + encodeURIComponent(id))
			.then(function (c) {
				document.getElementById("nome").value = c.nome || "";
				document.getElementById("cpf").value = formatarCpfExibicao(c.cpf) || c.cpf || "";
				document.getElementById("dataNascimento").value = c.dataNascimento || "";
				document.getElementById("endereco").value = c.endereco || "";
			})
			.catch(function (e) {
				showMsg(formatarErroValidacao(e.body || {}) || e.message, "alert-error");
			});
	}

	form.addEventListener("submit", function (ev) {
		ev.preventDefault();
		showMsg("", "");
		const body = {
			nome: document.getElementById("nome").value,
			cpf: document.getElementById("cpf").value,
			dataNascimento: document.getElementById("dataNascimento").value,
			endereco: document.getElementById("endereco").value || null,
		};
		const url = id ? "/clientes/" + encodeURIComponent(id) : "/clientes";
		const method = id ? "PUT" : "POST";
		apiRequest(url, { method: method, body: JSON.stringify(body) })
			.then(function () {
				window.location.href = "/clientes.html";
			})
			.catch(function (e) {
				showMsg(formatarErroValidacao(e.body || {}) || e.message, "alert-error");
			});
	});
})();
