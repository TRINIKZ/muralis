(function () {
	const msg = document.getElementById("msg");
	const wrap = document.getElementById("tabelaWrap");
	const busca = document.getElementById("busca");
	const btnBuscar = document.getElementById("btnBuscar");
	const btnExcluirTodos = document.getElementById("btnExcluirTodos");
	const screenFade = document.getElementById("screenFade");

	const FADE_TO_BLACK_DURATION_MS = 1;
	const FADE_BLACK_HOLD_MS = 250;
	const FADE_RETURN_DURATION_MS = 4200;

	function showMsg(html, cls) {
		msg.innerHTML = html ? '<div class="alert ' + cls + '">' + html + "</div>" : "";
	}

	function renderTable(rows) {
		if (!rows.length) {
			wrap.innerHTML = '<p class="empty">Nenhum cliente encontrado.</p>';
			return;
		}
		let html =
			"<table><thead><tr><th>Nome</th><th>CPF</th><th>Nascimento</th><th>Contatos</th><th></th></tr></thead><tbody>";
		for (const c of rows) {
			const qtd = c.quantidadeContatos != null ? c.quantidadeContatos : "—";
			html +=
				"<tr><td>" +
				escapeHtml(c.nome) +
				"</td><td>" +
				escapeHtml(formatarCpfExibicao(c.cpf)) +
				"</td><td>" +
				escapeHtml(formatarDataBR(c.dataNascimento)) +
				"</td><td>" +
				qtd +
				'</td><td class="actions-cell">' +
				'<a class="btn btn-secondary" href="/contatos.html?clienteId=' +
				c.id +
				'">Detalhes</a> ' +
				'<a class="btn btn-secondary btn-edit" href="/cliente-form.html?id=' +
				c.id +
				'">Editar</a> ' +
				'<button type="button" class="btn-danger" data-del="' +
				c.id +
				'">Excluir</button></td></tr>';
		}
		html += "</tbody></table>";
		wrap.innerHTML = html;
		wrap.querySelectorAll("button[data-del]").forEach(function (btn) {
			btn.addEventListener("click", function () {
				const id = btn.getAttribute("data-del");
				if (!confirm("Excluir este cliente e todos os contatos?")) return;
				apiRequest("/clientes/" + id, { method: "DELETE" })
					.then(function () {
						showMsg("Cliente excluído.", "alert-success");
						load();
					})
					.catch(function (e) {
						const m =
							e.status === 400 || e.status === 404
								? e.message
								: formatarErroValidacao(e.body || {});
						showMsg(m, "alert-error");
					});
			});
		});
	}

	function wait(ms) {
		return new Promise(function (resolve) {
			window.setTimeout(resolve, ms);
		});
	}

	function animarEscurecimento() {
		if (!screenFade) {
			return Promise.resolve();
		}
		screenFade.style.transition = "opacity 0.001s linear";
		screenFade.classList.add("is-active");
		return wait(FADE_TO_BLACK_DURATION_MS)
			.then(function () {
				return wait(FADE_BLACK_HOLD_MS);
			})
			.then(function () {
				screenFade.style.transition = "opacity 4.2s ease-out";
				screenFade.classList.remove("is-active");
				return wait(FADE_RETURN_DURATION_MS);
			})
			.finally(function () {
				screenFade.style.transition = "";
			});
	}

	function escapeHtml(s) {
		return String(s)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	function load() {
		showMsg("", "");
		const termo = busca.value.trim();
		const path = termo ? "/clientes/busca?termo=" + encodeURIComponent(termo) : "/clientes";
		apiRequest(path)
			.then(renderTable)
			.catch(function (e) {
				showMsg(formatarErroValidacao(e.body || {}) || e.message, "alert-error");
				wrap.innerHTML = "";
			});
	}

	btnBuscar.addEventListener("click", load);
	busca.addEventListener("keydown", function (ev) {
		if (ev.key === "Enter") load();
	});

	btnExcluirTodos.addEventListener("click", function () {
		btnExcluirTodos.disabled = true;
		showMsg("", "");
		renderTable([]);
		animarEscurecimento();
		apiRequest("/clientes", { method: "DELETE" })
			.catch(function (e) {
				const m =
					e && (e.status === 400 || e.status === 404)
						? e.message
						: formatarErroValidacao((e && e.body) || {}) || ((e && e.message) || "Erro ao excluir todos os clientes.");
				showMsg(m, "alert-error");
				load();
			})
			.finally(function () {
				btnExcluirTodos.disabled = false;
			});
	});

	load();
})();
