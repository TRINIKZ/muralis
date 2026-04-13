package clients.example.muralis.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import clients.example.muralis.dto.ClienteRequest;
import clients.example.muralis.dto.ClienteResponse;
import clients.example.muralis.dto.ContatoRequest;
import clients.example.muralis.dto.ContatoResponse;
import clients.example.muralis.service.ClienteService;
import clients.example.muralis.service.ContatoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/clientes")
@RequiredArgsConstructor
public class ClienteController {

	private final ClienteService clienteService;
	private final ContatoService contatoService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public ClienteResponse criar(@Valid @RequestBody ClienteRequest request) {
		return clienteService.criar(request);
	}

	@GetMapping
	public List<ClienteResponse> listar() {
		return clienteService.listar();
	}

	@GetMapping("/busca")
	public List<ClienteResponse> buscar(@RequestParam(required = false) String termo) {
		return clienteService.buscar(termo);
	}

	@GetMapping("/{id}")
	public ClienteResponse buscarPorId(@PathVariable Long id) {
		return clienteService.buscarPorId(id);
	}

	@PutMapping("/{id}")
	public ClienteResponse atualizar(@PathVariable Long id, @Valid @RequestBody ClienteRequest request) {
		return clienteService.atualizar(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void excluir(@PathVariable Long id) {
		clienteService.excluir(id);
	}

	@PostMapping("/{clienteId}/contatos")
	@ResponseStatus(HttpStatus.CREATED)
	public ContatoResponse criarContato(
			@PathVariable Long clienteId,
			@Valid @RequestBody ContatoRequest request) {
		return contatoService.criar(clienteId, request);
	}

	@GetMapping("/{clienteId}/contatos")
	public List<ContatoResponse> listarContatos(@PathVariable Long clienteId) {
		return contatoService.listarPorCliente(clienteId);
	}
}
