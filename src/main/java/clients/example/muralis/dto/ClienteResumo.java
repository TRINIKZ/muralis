package clients.example.muralis.dto;

import java.time.LocalDate;

/**
 * Projeção para listagem com contagem de contatos sem carregar a coleção.
 */
public record ClienteResumo(
		Long id,
		String nome,
		String cpf,
		LocalDate dataNascimento,
		String endereco,
		long quantidadeContatos
) {
}
