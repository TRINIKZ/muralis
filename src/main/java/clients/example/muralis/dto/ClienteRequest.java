package clients.example.muralis.dto;

import clients.example.muralis.validation.CpfValido;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClienteRequest {

	@NotBlank(message = "Nome é obrigatório")
	@Size(max = 200, message = "Nome deve ter no máximo 200 caracteres")
	private String nome;

	@NotBlank(message = "CPF é obrigatório")
	@CpfValido
	@Size(max = 14, message = "CPF inválido")
	private String cpf;

	@NotNull(message = "Data de nascimento é obrigatória")
	@Past(message = "Data de nascimento deve ser uma data válida no passado")
	@JsonFormat(pattern = "yyyy-MM-dd")
	private LocalDate dataNascimento;

	@Size(max = 500, message = "Endereço deve ter no máximo 500 caracteres")
	private String endereco;
}
