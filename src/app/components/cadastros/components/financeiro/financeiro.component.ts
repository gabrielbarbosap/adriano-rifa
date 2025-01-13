import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
  selector: "app-financeiro",
  templateUrl: "./financeiro.component.html",
  styleUrls: ["./financeiro.component.scss"],
})
export class FinanceiroComponent implements OnInit {
  detalhadoForm: FormGroup;
  @Input() formulario: any;

  constructor(private fb: FormBuilder) {
    this.detalhadoForm = this.fb.group({
      edicao: ["", Validators.required],
      nome_sorteio: ["", Validators.required],
      data_sorteio: ["", Validators.required],
      data_inicio: ["", Validators.required],
      valor_transacao: ["", Validators.required],
      valor_venda: ["", Validators.required],
      premio_bruto: ["", Validators.required],
      percentual_resgate: ["", Validators.required],
      premio_principal: ["", Validators.required],
      premio_liquido: ["", Validators.required],
      ir_sobre_premio: ["", Validators.required],
      taxa_ir: ["", Validators.required],
      serie: ["", Validators.required],
      entidade: ["", Validators.required],
      banco: ["", Validators.required],
      distribuidor: ["", Validators.required],
      plataforma_vendas: ["", Validators.required],
      processo_susepe: ["", Validators.required],
      transacoes_bancarias: ["", Validators.required],
      regularidade: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    const form = this.formulario.value;

    this.detalhadoForm.patchValue({
      edicao: form.edicao,
      data_sorteio: form.data_sorteio,
      data_inicio: form.data_inicio_vendas,
      valor_venda: form.valor_venda_titulo,
      premio_bruto: form.premiacao_bruta,
      premio_principal: form.premio_principal,
      serie: form.serie,
      entidade: form.id_entidade,
      processo_susepe: form.processo_susepe,
    });
  }

  onSubmit(): void {
    if (this.detalhadoForm.valid) {
      console.log("Formulário enviado com sucesso:", this.detalhadoForm.value);
    } else {
      console.error("Formulário inválido");
    }
  }
}
