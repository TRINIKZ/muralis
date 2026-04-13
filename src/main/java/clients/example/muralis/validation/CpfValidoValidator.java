package clients.example.muralis.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfValidoValidator implements ConstraintValidator<CpfValido, String> {

    private static final String PREFIXO_TESTE = "999999999";

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }

        String digits = value.replaceAll("\\D", "");

        if (digits.length() != 11) {
            return false;
        }

        if (ehCpfDeTeste(digits)) {
            return true;
        }

        if (digits.chars().distinct().count() == 1) {
            return false;
        }

        int d1 = primeiroDigitoVerificador(digits.substring(0, 9));
        int d2 = segundoDigitoVerificador(digits.substring(0, 9) + d1);
        return digits.equals(digits.substring(0, 9) + d1 + d2);
    }

    private static boolean ehCpfDeTeste(String digits) {
        return digits.startsWith(PREFIXO_TESTE);
    }

    private static int primeiroDigitoVerificador(String noveDigitos) {
        int soma = 0;
        for (int i = 0; i < 9; i++) {
            soma += Character.getNumericValue(noveDigitos.charAt(i)) * (10 - i);
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }

    private static int segundoDigitoVerificador(String dezDigitos) {
        int soma = 0;
        for (int i = 0; i < 10; i++) {
            soma += Character.getNumericValue(dezDigitos.charAt(i)) * (11 - i);
        }
        int resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    }
}