package clients.example.muralis.controller;

import clients.example.muralis.dto.ContatoRequest;
import clients.example.muralis.dto.ContatoResponse;
import clients.example.muralis.service.ContatoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/contatos")
@RequiredArgsConstructor
public class ContatoController {

	private final ContatoService contatoService;

	@PutMapping("/{id}")
	public ContatoResponse atualizar(@PathVariable Long id, @Valid @RequestBody ContatoRequest request) {
		return contatoService.atualizar(id, request);
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void excluir(@PathVariable Long id) {
		contatoService.excluir(id);
	}
}
