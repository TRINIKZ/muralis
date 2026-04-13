package clients.example.muralis.repository;

import clients.example.muralis.entity.Contato;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContatoRepository extends JpaRepository<Contato, Long> {

	List<Contato> findByClienteIdOrderByIdAsc(Long clienteId);
}
