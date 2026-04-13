package clients.example.muralis.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContatoRequest {

	@NotBlank(message = "Tipo do contato é obrigatório")
	@Size(max = 50, message = "Tipo deve ter no máximo 50 caracteres")
	private String tipo;

	@NotBlank(message = "Valor do contato é obrigatório")
	@Size(max = 200, message = "Valor deve ter no máximo 200 caracteres")
	private String valor;

	@Size(max = 500, message = "Observação deve ter no máximo 500 caracteres")
	private String observacao;
}
