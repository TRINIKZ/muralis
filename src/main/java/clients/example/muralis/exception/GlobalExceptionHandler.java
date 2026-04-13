package clients.example.muralis.exception;

import clients.example.muralis.dto.ErroResponse;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErroResponse> handleValidation(MethodArgumentNotValidException ex) {
		Map<String, String> fieldErrors = new HashMap<>();
		for (FieldError fe : ex.getBindingResult().getFieldErrors()) {
			fieldErrors.put(fe.getField(), fe.getDefaultMessage());
		}
		ErroResponse body = ErroResponse.builder()
				.timestamp(Instant.now())
				.status(HttpStatus.BAD_REQUEST.value())
				.error("Erro de validação")
				.message("Verifique os campos informados")
				.fieldErrors(fieldErrors)
				.build();
		return ResponseEntity.badRequest().body(body);
	}

	@ExceptionHandler(RecursoNaoEncontradoException.class)
	public ResponseEntity<ErroResponse> handleNotFound(RecursoNaoEncontradoException ex) {
		ErroResponse body = ErroResponse.builder()
				.timestamp(Instant.now())
				.status(HttpStatus.NOT_FOUND.value())
				.error("Não encontrado")
				.message(ex.getMessage())
				.build();
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
	}

	@ExceptionHandler(CpfDuplicadoException.class)
	public ResponseEntity<ErroResponse> handleCpfDuplicado(CpfDuplicadoException ex) {
		ErroResponse body = ErroResponse.builder()
				.timestamp(Instant.now())
				.status(HttpStatus.CONFLICT.value())
				.error("Conflito")
				.message(ex.getMessage())
				.build();
		return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ResponseEntity<ErroResponse> handleDataIntegrity(DataIntegrityViolationException ex) {
		String msg = "Violação de integridade dos dados";
		if (ex.getMessage() != null && ex.getMessage().toLowerCase().contains("cpf")) {
			msg = "CPF já cadastrado";
		}
		ErroResponse body = ErroResponse.builder()
				.timestamp(Instant.now())
				.status(HttpStatus.CONFLICT.value())
				.error("Conflito")
				.message(msg)
				.build();
		return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
	}
}
