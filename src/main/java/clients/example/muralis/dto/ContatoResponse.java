package clients.example.muralis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContatoResponse {

	private Long id;
	private Long clienteId;
	private String tipo;
	private String valor;
	private String observacao;
}
