package clients.example.muralis.repository;

import clients.example.muralis.dto.ClienteResumo;
import clients.example.muralis.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {

	Optional<Cliente> findByCpf(String cpf);

	boolean existsByCpf(String cpf);

	boolean existsByCpfAndIdNot(String cpf, Long id);

	@Query("""
			SELECT NEW clients.example.muralis.dto.ClienteResumo(
			  c.id, c.nome, c.cpf, c.dataNascimento, c.endereco, SIZE(c.contatos))
			FROM Cliente c ORDER BY c.nome
			""")
	List<ClienteResumo> findAllResumo();

	@Query("""
			SELECT NEW clients.example.muralis.dto.ClienteResumo(
			  c.id, c.nome, c.cpf, c.dataNascimento, c.endereco, SIZE(c.contatos))
			FROM Cliente c
			WHERE LOWER(c.nome) LIKE LOWER(CONCAT('%', :termo, '%'))
			   OR c.cpf LIKE CONCAT('%', :cpfNumeros, '%')
			ORDER BY c.nome
			""")
	List<ClienteResumo> buscarResumo(@Param("termo") String termo, @Param("cpfNumeros") String cpfNumeros);
}
