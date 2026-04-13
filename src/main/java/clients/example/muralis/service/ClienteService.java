package clients.example.muralis.service;

import clients.example.muralis.dto.ClienteRequest;
import clients.example.muralis.dto.ClienteResponse;
import clients.example.muralis.dto.ClienteResumo;
import clients.example.muralis.dto.ContatoResponse;
import clients.example.muralis.entity.Cliente;
import clients.example.muralis.entity.Contato;
import clients.example.muralis.exception.CpfDuplicadoException;
import clients.example.muralis.exception.RecursoNaoEncontradoException;
import clients.example.muralis.repository.ClienteRepository;
import clients.example.muralis.util.CpfUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClienteService {

	private static final String CPF_BUSCA_VAZIO = "__no_cpf_digits__";

	private final ClienteRepository clienteRepository;

	@Transactional(readOnly = true)
	public List<ClienteResponse> listar() {
		return clienteRepository.findAllResumo().stream().map(this::fromResumo).toList();
	}

	@Transactional(readOnly = true)
	public List<ClienteResponse> buscar(String termo) {
		if (termo == null || termo.isBlank()) {
			return listar();
		}
		String t = termo.trim();
		String numeros = CpfUtil.somenteDigitos(t);
		String cpfParte = numeros.isEmpty() ? CPF_BUSCA_VAZIO : numeros;
		return clienteRepository.buscarResumo(t, cpfParte).stream().map(this::fromResumo).toList();
	}

	@Transactional(readOnly = true)
	public ClienteResponse buscarPorId(Long id) {
		Cliente cliente = clienteRepository.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado"));
		List<ContatoResponse> contatos = cliente.getContatos().stream()
				.map(this::toContatoResponse)
				.toList();
		return toResponseDetalhe(cliente, contatos);
	}

	@Transactional
	public ClienteResponse criar(ClienteRequest request) {
		String cpf = CpfUtil.somenteDigitos(request.getCpf());
		if (clienteRepository.existsByCpf(cpf)) {
			throw new CpfDuplicadoException("Já existe cliente cadastrado com este CPF");
		}
		Cliente cliente = Cliente.builder()
				.nome(request.getNome().trim())
				.cpf(cpf)
				.dataNascimento(request.getDataNascimento())
				.endereco(trimToNull(request.getEndereco()))
				.build();
		Cliente salvo = clienteRepository.save(cliente);
		return fromResumo(new ClienteResumo(
				salvo.getId(),
				salvo.getNome(),
				salvo.getCpf(),
				salvo.getDataNascimento(),
				salvo.getEndereco(),
				0L));
	}

	@Transactional
	public ClienteResponse atualizar(Long id, ClienteRequest request) {
		Cliente cliente = clienteRepository.findById(id)
				.orElseThrow(() -> new RecursoNaoEncontradoException("Cliente não encontrado"));
		String cpf = CpfUtil.somenteDigitos(request.getCpf());
		if (clienteRepository.existsByCpfAndIdNot(cpf, id)) {
			throw new CpfDuplicadoException("Já existe outro cliente cadastrado com este CPF");
		}
		cliente.setNome(request.getNome().trim());
		cliente.setCpf(cpf);
		cliente.setDataNascimento(request.getDataNascimento());
		cliente.setEndereco(trimToNull(request.getEndereco()));
		clienteRepository.save(cliente);
		return buscarPorId(id);
	}

	@Transactional
	public void excluir(Long id) {
		if (!clienteRepository.existsById(id)) {
			throw new RecursoNaoEncontradoException("Cliente não encontrado");
		}
		clienteRepository.deleteById(id);
	}

	private ClienteResponse fromResumo(ClienteResumo r) {
		return ClienteResponse.builder()
				.id(r.id())
				.nome(r.nome())
				.cpf(r.cpf())
				.dataNascimento(r.dataNascimento())
				.endereco(r.endereco())
				.quantidadeContatos((int) r.quantidadeContatos())
				.build();
	}

	private ClienteResponse toResponseDetalhe(Cliente cliente, List<ContatoResponse> contatos) {
		return ClienteResponse.builder()
				.id(cliente.getId())
				.nome(cliente.getNome())
				.cpf(cliente.getCpf())
				.dataNascimento(cliente.getDataNascimento())
				.endereco(cliente.getEndereco())
				.quantidadeContatos(contatos.size())
				.contatos(contatos)
				.build();
	}

	private ContatoResponse toContatoResponse(Contato c) {
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
