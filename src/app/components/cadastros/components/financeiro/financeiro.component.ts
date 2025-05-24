import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogService } from "@nebular/theme";
import { ErrorReqComponent } from "src/app/components/error-req/error-req.component";
import { SucessReqComponent } from "src/app/components/sucess-req/sucess-req.component";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-financeiro",
  templateUrl: "./financeiro.component.html",
  styleUrls: ["./financeiro.component.scss"],
})
export class FinanceiroComponent implements OnInit {
  detalhadoForm: FormGroup;
  entidades: any[] = [];
  @Input() formulario: any;

  bancos = [
    { codigo: "001", nome: "Banco do Brasil S.A." },
    { codigo: "033", nome: "Banco Santander (Brasil) S.A." },
    { codigo: "104", nome: "Caixa Econômica Federal" },
    { codigo: "237", nome: "Banco Bradesco S.A." },
    { codigo: "341", nome: "Itaú Unibanco S.A." },
    { codigo: "745", nome: "Banco Citibank S.A." },
    { codigo: "422", nome: "Banco Safra S.A." },
    { codigo: "070", nome: "Banco de Brasília S.A. (BRB)" },
    { codigo: "389", nome: "Banco Mercantil do Brasil S.A." },
    { codigo: "756", nome: "Banco Cooperativo do Brasil S.A. (Bancoob)" },
    { codigo: "260", nome: "Nu Pagamentos S.A. (Nubank)" },
    { codigo: "077", nome: "Banco Inter S.A." },
    { codigo: "290", nome: "Pagseguro Internet S.A. (PagBank)" },
    { codigo: "380", nome: "PicPay Serviços S.A." },
    { codigo: "323", nome: "MercadoPago.com Representações Ltda." },
    {
      codigo: "041",
      nome: "Banco do Estado do Rio Grande do Sul S.A. (Banrisul)",
    },
    { codigo: "085", nome: "Cooperativa Central de Crédito Urbano - Cecred" },
    { codigo: "136", nome: "Unicred Cooperativa" },
    { codigo: "655", nome: "Banco Votorantim S.A." },
    { codigo: "999", nome: "Asaas I.P S.A" },
    { codigo: "888", nome: "CCR De São Miguel do Oeste" },
    { codigo: "777", nome: "Viacred" },
    { codigo: "333", nome: "Ailos" },
    { codigo: "555", nome: "Banco Sicoob" },
    { codigo: "000", nome: "C6 Bank" },
    { codigo: "0031", nome: "Banco Banestes" },
    { codigo: "0032", nome: "BPP Instituição de Pagamentos S.A" },
    { codigo: "0033", nome: "Banco Cooperativo Sicred S.A" },
    { codigo: "0034", nome: "Dock Instituição de Pagamentos S.A" },
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private dialogService: NbDialogService
  ) {
    this.detalhadoForm = this.fb.group({
      edicao: ["", Validators.required],
      nome_sorteio: ["", Validators.required],
      data_sorteio: ["", Validators.required],
      data_inicio_vendas: ["", Validators.required],
      valor_transacao: ["", Validators.required],
      valor_venda_titulo: ["", Validators.required],
      premiacao_bruta: ["", Validators.required],
      resgate: ["", Validators.required],
      premio_principal: ["", Validators.required],
      premio_liquido: ["", Validators.required],
      ir_sobre_premio: ["", Validators.required],
      ir_titulos_premiados: ["", Validators.required],
      serie: ["", Validators.required],
      id_entidade: ["", Validators.required],
      banco: ["", Validators.required],
      distribuidor: ["", Validators.required],
      plataforma_vendas: ["", Validators.required],
      processo_susepe: ["", Validators.required],
      transacoes_bancarias: ["", Validators.required],
      per_regularidade: ["", Validators.required],
      vendidos: [""],
    });
  }

  ngOnInit(): void {
    this.loadEntidades();
  }

  private loadEntidades(): void {
    this.supabaseService.buscarDados("entidade").subscribe({
      next: (entidades) => {
        this.entidades = entidades;

        // Atualiza o formulário apenas após carregar as entidades
        this.initializeForm();
      },
      error: (err) => {
        console.error("Erro ao carregar entidades:", err);
      },
    });
  }

  private initializeForm(): void {
    if (!this.formulario) {
      console.log("Dados recebidos no formulário:", this.formulario);

      // Patch apenas com valores existentes no formulário
      this.detalhadoForm.patchValue({
        edicao: this.formulario.edicao || "",
        nome_sorteio: this.formulario.nome_sorteio || "",
        data_sorteio: this.formulario.data_sorteio || "",
        data_inicio_vendas: this.formulario.data_inicio_vendas || "",
        valor_transacao: this.formulario.valor_transacao || "",
        valor_venda_titulo: this.formulario.valor_venda_titulo || "",
        premiacao_bruta: this.formulario.premiacao_bruta || "",
        resgate: this.formulario.resgate || "",
        premio_principal: this.formulario.premio_principal || "",
        premio_liquido: this.formulario.premio_liquido || "",
        ir_sobre_premio: this.formulario.ir_sobre_premio || "",
        ir_titulos_premiados: this.formulario.ir_titulos_premiados || "",
        serie: this.formulario.serie || "",
        id_entidade: this.formulario.id_entidade || null, // Garantir que id_entidade seja null se não existir
        banco: this.formulario.banco || "",
        distribuidor: this.formulario.distribuidor || "",
        plataforma_vendas: this.formulario.plataforma_vendas || "",
        processo_susepe: this.formulario.processo_susepe || "",
        transacoes_bancarias: this.formulario.transacoes_bancarias || "",
        per_regularidade: this.formulario.per_regularidade || "",
        vendidos: this.formulario.vendidos || "",
      });
    }
  }

  onSubmit(): void {
    if (this.detalhadoForm.valid) {
      this.onEdit();
    } else {
      console.error("Formulário inválido:", this.detalhadoForm.errors);
    }
  }

  async onEdit() {
    try {
      const formData = this.detalhadoForm.value;
      const id = formData.edicao; // Assumindo que o campo "edicao" é usado como identificador único
      const nameTable = "sorteio";

      await this.supabaseService.updateSorteio(formData, nameTable, id);
      this.open(true);

      console.log("Dados atualizados com sucesso!");
    } catch (error) {
      this.openError(true);

      console.error("Erro ao atualizar dados:", error);
    }
  }

  protected open(hasBackdrop: boolean) {
    this.dialogService.open(SucessReqComponent, { hasBackdrop });
  }

  protected openError(hasBackdrop: boolean) {
    this.dialogService.open(ErrorReqComponent, { hasBackdrop });
  }
}
