package clients.example.muralis.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErroResponse {

	private Instant timestamp;
	private int status;
	private String error;
	private String message;
	private Map<String, String> fieldErrors;
}
