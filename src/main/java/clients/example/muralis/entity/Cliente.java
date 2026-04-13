package clients.example.muralis.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cliente")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 200)
	private String nome;

	@Column(nullable = false, unique = true, length = 14)
	private String cpf;

	@Column(name = "data_nascimento", nullable = false)
	private LocalDate dataNascimento;

	@Column(length = 500)
	private String endereco;

	@OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
	@Builder.Default
	private List<Contato> contatos = new ArrayList<>();

	public void adicionarContato(Contato contato) {
		contatos.add(contato);
		contato.setCliente(this);
	}

	public void removerContato(Contato contato) {
		contatos.remove(contato);
		contato.setCliente(null);
	}
}
