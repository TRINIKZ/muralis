package clients.example.muralis.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClienteResponse {

	private Long id;
	private String nome;
	private String cpf;

	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate dataNascimento;

	private String endereco;
	private Integer quantidadeContatos;
	private List<ContatoResponse> contatos;
}
