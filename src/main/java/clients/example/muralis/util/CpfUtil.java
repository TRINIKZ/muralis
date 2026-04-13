package clients.example.muralis.util;

public final class CpfUtil {

	private CpfUtil() {
	}

	public static String somenteDigitos(String cpf) {
		if (cpf == null) {
			return null;
		}
		return cpf.replaceAll("\\D", "");
	}
}
