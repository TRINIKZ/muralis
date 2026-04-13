package clients.example.muralis.service;

import clients.example.muralis.dto.ContatoRequest;
import clients.example.muralis.dto.ContatoResponse;
import clients.example.muralis.entity.Cliente;
import clients.example.muralis.entity.Contato;
import clients.example.muralis.exception.RecursoNaoEncontradoException;
import clients.example.muralis.repository.ClienteRepository;
import clients.example.muralis.repository.ContatoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContatoService {

	private final ContatoRepository contatoRepository;
	private final ClienteRepository clienteRepository;

	@Transactional(readOnly = true)
	public List<ContatoResponse> listarPorCliente(Long clienteId) {
		garantirClienteExiste(clienteId);
		return contatoRepository.findByClienteIdOrderByIdAsc(clienteId).stream()
				.map(this::toResponse)
				.toList();
	}

	@Transactional
	public ContatoResponse criar(Long clienteId, ContatoRequest request) {
		Cliente cliente = clienteRepository.findById(clienteId)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado"));
		Contato contato = Contato.builder()
				.cliente(cliente)
				.tipo(request.getTipo().trim())
				.valor(request.getValor().trim())
				.observacao(trimToNull(request.getObservacao()))
				.build();
		cliente.adicionarContato(contato);
		Contato salvo = contatoRepository.save(contato);
		return toResponse(salvo);
	}

	@Transactional
	public ContatoResponse atualizar(Long id, ContatoRequest request) {
		Contato contato = contatoRepository.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Contato não encontrado"));
		contato.setTipo(request.getTipo().trim());
		contato.setValor(request.getValor().trim());
		contato.setObservacao(trimToNull(request.getObservacao()));
		return toResponse(contatoRepository.save(contato));
	}

	@Transactional
	public void excluir(Long id) {
		Contato contato = contatoRepository.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Contato não encontrado"));
		contato.getCliente().removerContato(contato);
		contatoRepository.delete(contato);
	}

	private void garantirClienteExiste(Long clienteId) {
		if (!clienteRepository.existsById(clienteId)) {
			throw new RecursoNaoEncontradoException("Cliente não encontrado");
		}
	}

	private ContatoResponse toResponse(Contato c) {
		return ContatoResponse.builder()
				.id(c.getId())
				.clienteId(c.getCliente().getId())
				.tipo(c.getTipo())
				.valor(c.getValor())
				.observacao(c.getObservacao())
				.build();
	}

	private static String trimToNull(String s) {
		if (s == null) {
			return null;
		}
		String t = s.trim();
		return t.isEmpty() ? null : t;
	}
}
