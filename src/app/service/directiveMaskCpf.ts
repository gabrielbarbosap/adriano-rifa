import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
  selector: "[appCpfMask]",
})
export class CpfMaskDirective {
  constructor(private el: ElementRef) {}

  @HostListener("input", ["$event"]) onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ""); // Remove todos os caracteres não numéricos

    if (value.length > 11) {
      value = value.slice(0, 11); // Limita o tamanho do CPF
    }

    // Aplica a máscara: 000.000.000-00
    const part1 = value.slice(0, 3);
    const part2 = value.slice(3, 6);
    const part3 = value.slice(6, 9);
    const part4 = value.slice(9, 11);

    input.value = part1
      ? `${part1}${part2 ? "." + part2 : ""}${part3 ? "." + part3 : ""}${
          part4 ? "-" + part4 : ""
        }`
      : "";
  }
}
