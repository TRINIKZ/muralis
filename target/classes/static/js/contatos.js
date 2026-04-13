(function () {
	const params = new URLSearchParams(window.location.search);
	const clienteId = params.get("clienteId");

	const msg = document.getElementById("msg");
	const conteudo = document.getElementById("conteudoPrincipal");
	const card = document.getElementById("clienteCard");
	const wrap = document.getElementById("tabelaWrap");
	const btnNovo = document.getElementById("btnNovoContato");
	const backdrop = document.getElementById("modalBackdrop");
	const formContato = document.getElementById("formContato");
	const btnFecharModal = document.getElementById("btnFecharModal");
	const modalTitulo = document.getElementById("modalTitulo");

	let clienteAtual = null;
	let editingContatoId = null;

	function escapeHtml(s) {
		return String(s)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;");
	}

	function showMsg(html, cls) {
		msg.innerHTML = html ? '<div class="alert ' + cls + '">' + html + "</div>" : "";
	}

	function openModal() {
		backdrop.classList.add("open");
	}

	function closeModal() {
		backdrop.classList.remove("open");
		editingContatoId = null;
		formContato.reset();
	}

	function renderClienteCard(c) {
		const end = c.endereco ? escapeHtml(c.endereco) : '<span class="muted">—</span>';
		card.innerHTML =
			"<h2>" +
			escapeHtml(c.nome) +
			"</h2>" +
			'<p class="muted" style="margin:0.35rem 0">CPF: ' +
			escapeHtml(formatarCpfExibicao(c.cpf)) +
			"</p>" +
			'<p class="muted" style="margin:0.35rem 0">Nascimento: ' +
			escapeHtml(formatarDataBR(c.dataNascimento)) +
			"</p>" +
			"<p style=\"margin:0.75rem 0 0\">" +
			end +
			"</p>";
	}

	function renderContatos(contatos) {
		if (!contatos || !contatos.length) {
			wrap.innerHTML = '<p class="empty">Nenhum contato cadastrado.</p>';
			return;
		}
		let html =
			"<table><thead><tr><th>Tipo</th><th>Valor</th><th>Observação</th><th></th></tr></thead><tbody>";
		for (const ct of contatos) {
			const obs = ct.observacao ? escapeHtml(ct.observacao) : '<span class="muted">—</span>';
			html +=
				"<tr><td>" +
				escapeHtml(ct.tipo) +
				"</td><td>" +
				escapeHtml(ct.valor) +
				"</td><td>" +
				obs +
				'</td><td class="actions-cell">' +
				'<button type="button" class="btn-secondary btn-edit" data-edit="' +
				ct.id +
				'">Editar</button> ' +
				'<button type="button" class="btn-danger" data-del="' +
				ct.id +
				'">Excluir</button></td></tr>';
		}
		html += "</tbody></table>";
		wrap.innerHTML = html;

		wrap.querySelectorAll("button[data-edit]").forEach(function (btn) {
			btn.addEventListener("click", function () {
				const id = parseInt(btn.getAttribute("data-edit"), 10);
				const ct = (clienteAtual.contatos || []).find(function (x) {
					return x.id === id;
				});
				if (!ct) return;
				editingContatoId = id;
				modalTitulo.textContent = "Editar contato";
				document.getElementById("tipo").value = ct.tipo || "";
				document.getElementById("valor").value = ct.valor || "";
				document.getElementById("observacao").value = ct.observacao || "";
				openModal();
			});
		});

		wrap.querySelectorAll("button[data-del]").forEach(function (btn) {
			btn.addEventListener("click", function () {
				const id = btn.getAttribute("data-del");
				if (!confirm("Excluir este contato?")) return;
				apiRequest("/contatos/" + encodeURIComponent(id), { method: "DELETE" })
					.then(function () {
						showMsg("Contato excluído.", "alert-success");
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

	function load() {
		showMsg("", "");
		if (!clienteId) {
			conteudo.hidden = true;
			showMsg(
				'Parâmetro <code>clienteId</code> é obrigatório. <a href="/clientes.html">Ir para clientes</a>',
				"alert-error",
			);
			return;
		}
		apiRequest("/clientes/" + encodeURIComponent(clienteId))
			.then(function (c) {
				clienteAtual = c;
				renderClienteCard(c);
				renderContatos(c.contatos || []);
				conteudo.hidden = false;
			})
			.catch(function (e) {
				clienteAtual = null;
				conteudo.hidden = true;
				showMsg(formatarErroValidacao(e.body || {}) || e.message, "alert-error");
				wrap.innerHTML = "";
			});
	}

	btnNovo.addEventListener("click", function () {
		if (!clienteId) return;
		editingContatoId = null;
		modalTitulo.textContent = "Novo contato";
		formContato.reset();
		openModal();
	});

	btnFecharModal.addEventListener("click", closeModal);
	backdrop.addEventListener("click", function (ev) {
		if (ev.target === backdrop) closeModal();
	});

	formContato.addEventListener("submit", function (ev) {
		ev.preventDefault();
		if (!clienteId) return;
		const body = {
			tipo: document.getElementById("tipo").value,
			valor: document.getElementById("valor").value,
			observacao: document.getElementById("observacao").value.trim() || null,
		};
		const isEdit = editingContatoId != null;
		const url = isEdit
			? "/contatos/" + encodeURIComponent(editingContatoId)
			: "/clientes/" + encodeURIComponent(clienteId) + "/contatos";
		const method = isEdit ? "PUT" : "POST";
		apiRequest(url, { method: method, body: JSON.stringify(body) })
			.then(function () {
				closeModal();
				showMsg(isEdit ? "Contato atualizado." : "Contato criado.", "alert-success");
				load();
			})
			.catch(function (e) {
				showMsg(formatarErroValidacao(e.body || {}) || e.message, "alert-error");
			});
	});

	load();
})();
