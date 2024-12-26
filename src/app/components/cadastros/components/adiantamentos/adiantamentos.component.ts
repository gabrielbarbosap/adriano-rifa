import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-adiantamentos",
  templateUrl: "./adiantamentos.component.html",
  styleUrls: ["./adiantamentos.component.scss"],
})
export class AdiantamentosComponent implements OnInit {
  pagamentoForm: FormGroup;
  total = 0;
  adiantamentosExistentes = [] as any;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService
  ) {
    this.pagamentoForm = this.fb.group({
      pagamentos: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.carregarAdiantamentos();
  }

  async carregarAdiantamentos() {
    try {
      const adiantamentos = await this.supabaseService.buscarAdiantamentos();
      this.adiantamentosExistentes = adiantamentos || [];
      this.preencherAdiantamentos(this.adiantamentosExistentes);
      this.calcularSaldoTotal();
    } catch (error) {
      console.error("Erro ao carregar adiantamentos:", error);
    }
  }

  get pagamentos(): FormArray {
    return this.pagamentoForm.get("pagamentos") as FormArray;
  }

  criarAdiantamento(
    id: number | null = null,
    data: string = "",
    descricao: string = "",
    tipo: string = "",
    valor: number = 0
  ): FormGroup {
    return this.fb.group({
      id: [id],
      data: [data, Validators.required],
      descricao: [descricao, Validators.required],
      tipo: [tipo, Validators.required],
      valor: [valor, Validators.required],
    });
  }

  preencherAdiantamentos(adiantamentos: any[]) {
    this.pagamentos.clear();
    adiantamentos.forEach((adiantamento) => {
      this.pagamentos.push(
        this.criarAdiantamento(
          adiantamento.id,
          adiantamento.data,
          adiantamento.descricao,
          adiantamento.tipo_valor,
          adiantamento.tipo_valor === "pagamento"
            ? -Math.abs(adiantamento.valor) // Garantir valor negativo para pagamentos
            : Math.abs(adiantamento.valor) // Garantir valor positivo para recebimentos
        )
      );
    });
  }

  adicionarAdiantamento() {
    this.pagamentos.push(this.criarAdiantamento());
  }

  removerAdiantamento(index: number, pagamento: any) {
    const pagamentoRemovido = this.pagamentos.at(index).value;
    if (pagamentoRemovido.tipo === "pagamento") {
      this.total += Math.abs(pagamentoRemovido.valor);
    } else {
      this.total -= Math.abs(pagamentoRemovido.valor);
    }

    this.supabaseService.deletarAdiantamento(pagamentoRemovido);
    this.pagamentos.removeAt(index);
    this.calcularSaldoTotal();
  }

  calcularSaldoTotal() {
    this.total = this.pagamentos.controls.reduce((saldo, pagamento) => {
      const valor = pagamento.get("valor")?.value || 0;
      return saldo + valor;
    }, 0);
  }

  async salvarAdiantamentos() {
    if (this.pagamentoForm.valid) {
      const pagamentos = this.pagamentoForm.value.pagamentos;

      try {
        for (const pagamento of pagamentos) {
          const valor =
            pagamento.tipo === "pagamento"
              ? -Math.abs(pagamento.valor) // Valor negativo para pagamentos
              : Math.abs(pagamento.valor); // Valor positivo para recebimentos

          const existente = this.adiantamentosExistentes.find(
            (adiantamento: { id: any; data: any }) =>
              adiantamento.id === pagamento.id &&
              adiantamento.data === pagamento.data
          );

          if (existente) {
            // Atualizar adiantamento existente
            await this.supabaseService.atualizarAdiantamento({
              id: pagamento.id,
              data: pagamento.data,
              descricao: pagamento.descricao,
              tipo_valor: pagamento.tipo,
              valor,
            });
          } else {
            // Inserir novo adiantamento
            await this.supabaseService.inserirAdiantamento({
              data: pagamento.data,
              descricao: pagamento.descricao,
              tipo_valor: pagamento.tipo,
              valor,
              id_sorteio: 123, // ID do sorteio, substituir conforme necessário
            });
          }
        }

        console.log("Adiantamentos salvos com sucesso.");
        this.carregarAdiantamentos(); // Recarregar lista após salvar
      } catch (error) {
        console.error("Erro ao salvar adiantamentos:", error);
      }
    } else {
      this.pagamentoForm.markAllAsTouched();
    }
  }
}
