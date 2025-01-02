import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const cpf = control.value;

    // Remover caracteres não numéricos
    const cpfClean = cpf.replace(/\D/g, "");

    if (cpfClean.length !== 11 || /^(\d)\1+$/.test(cpfClean)) {
      return { invalidCpf: true };
    }

    let sum = 0;
    let remainder;

    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cpfClean.substring(i - 1, i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpfClean.substring(9, 10))) {
      return { invalidCpf: true };
    }

    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cpfClean.substring(i - 1, i)) * (12 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpfClean.substring(10, 11))) {
      return { invalidCpf: true };
    }

    return null;
  };
}
