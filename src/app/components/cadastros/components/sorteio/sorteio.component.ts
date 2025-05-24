import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { NbDialogService, NbMenuService } from "@nebular/theme";
import { ActivatedRoute } from "@angular/router";
import { SucessReqComponent } from "src/app/components/sucess-req/sucess-req.component";
import { SupabaseService } from "src/app/service/supabase.service";
import { ErrorReqComponent } from "src/app/components/error-req/error-req.component";
import { CapitalizadoraService } from "src/app/service/capitalizadora.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { forkJoin } from "rxjs/internal/observable/forkJoin";

@Component({
  selector: "app-sorteio",
  templateUrl: "./sorteio.component.html",
  styleUrls: ["./sorteio.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SorteioComponent {
  cadastroForm: FormGroup;
  dinamicForms: any;
  regulamento = new FormControl("", [
    Validators.required,
    Validators.minLength(1),
  ]);

  isEdit = false;
  isEditTab = false;
  cadastroSorteado = false;
  integradoraSistema = [] as any;
  integradoras = [] as any;
  entidades = [] as any;
  capitalizadoras = [] as any;
  influencers = [] as any;
  dataInput: any;

  items = [
    { title: "Sorteio" },
    { title: "Ganhadores" },
    { title: "Adiantamentos" },
    { title: "Financeiro" },
    { title: "Regulamento PSTC" },
    { title: "Números Premiados" },
  ];

  invalidFields: string[] = [];

  capitalizadora = [] as any;

  success = false;
  error = false;

  badgeText = "!";
  badgeStatus = "warning";
  constructor(
    private fb: FormBuilder,
    private nbMenuService: NbMenuService,
    private supabaseService: SupabaseService,
    private captalizadoraService: CapitalizadoraService,
    private dialogService: NbDialogService,
    private route: ActivatedRoute
  ) {
    this.cadastroForm = this.fb.group({
      edicao: ["", Validators.required],
      data_sorteio: ["", Validators.required],
      processo_susepe: ["", Validators.required],
      premio_principal: ["", Validators.required],
      serie: ["", Validators.required],
      tipo_sorteio: ["", Validators.required],
      venda_minima: ["", Validators.required],
      cota_sorteio: ["", Validators.required],
      data_carregamento: [null, Validators.required],
      data_resgate: ["", Validators.required],
      premiacao_bruta: ["", Validators.required],
      id_entidade: [null, Validators.required],
      produto: ["", Validators.required],
      id_sistema: [Validators.required],
      id_influencer: [null, Validators.required],
      cota_resgate: [null, Validators.required],
      nome_processo: ["SUSEPE"],
      titulos_premiados: [""],
      valor_venda_titulo: [""],
      data_inicio_vendas: [""],
      id_banco: [""],
      capitalizadora: [null],
      obs_integradora: [""],
      obs_capitalizadora: [null],
      data_real: [null],
      capital_minimo: [null],
      cota_carregamento: [null],
    });

    this.regulamento.valueChanges.subscribe((it) => {
      if (it) {
        this.badgeStatus = "";
        this.badgeText = "";
      } else {
        this.badgeText = "!";
        this.badgeStatus = "warning";
      }
    });

    this.dinamicForms = this.fb.group({
      documents: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const sorteioId = this.route.snapshot.paramMap.get("id");
    const influencerId = this.route.snapshot.paramMap.get("idInfluencer");

    if (sorteioId) {
      // Primeiro carrega os dados necessários
      forkJoin([
        this.supabaseService.buscarDados("banco"),
        this.supabaseService.buscarDados("entidade"),
        this.supabaseService.buscarDados("sistema"),
        this.supabaseService.buscarDados("influencer"),
        this.supabaseService.buscarDados("capitalizadoras"),
        this.supabaseService.getSorteioById(sorteioId, influencerId),
      ]).subscribe(
        ([bancos, entidades, sistemas, influencers, capitalizadoras, data]) => {
          this.integradoras = bancos;
          this.entidades = entidades;
          this.integradoraSistema = sistemas;
          this.influencers = influencers;
          this.capitalizadoras = capitalizadoras;

          if (data) {
            this.dataInput = data;

            this.cadastroForm.patchValue({
              ...data,
              id_influencer: Number(data.id_influencer),
              id_sistema: Number(data.id_sistema),
              id_entidade: Number(data.id_entidade),
              id_banco: Number(data.id_banco),
            });

            this.regulamento.setValue(data.regulamento);
            localStorage.setItem("id_sorteio", data.id);
            this.isEdit = false;
            this.isEditTab = true;
          }
        }
      );
    } else {
      this.capturarDados();
    }
  }

  loadData() {
    this.supabaseService
      .buscarDados("banco")
      .subscribe((it) => (this.integradoras = it));

    this.supabaseService
      .buscarDados("entidade")
      .subscribe((it) => (this.entidades = it));

    this.supabaseService
      .buscarDados("sistema")
      .subscribe((it) => (this.integradoraSistema = it));

    this.supabaseService
      .buscarDados("influencer")
      .subscribe((it) => (this.influencers = it));

    this.supabaseService
      .buscarDados("capitalizadoras")
      .subscribe((it) => (this.capitalizadoras = it));

    this.isEdit = true;
  }

  clickCadastroSorteado() {
    console.log("clicou");
    this.cadastroSorteado = !this.cadastroSorteado;
  }

  capturarDados() {
    this.supabaseService
      .buscarDados("banco")
      .subscribe((it) => (this.integradoras = it));

    this.supabaseService
      .buscarDados("entidade")
      .subscribe((it) => (this.entidades = it));

    this.supabaseService
      .buscarDados("sistema")
      .subscribe((it) => (this.integradoraSistema = it));

    this.supabaseService
      .buscarDados("influencer")
      .subscribe((it) => (this.influencers = it));

    this.supabaseService
      .buscarDados("capitalizadoras")
      .subscribe((it) => (this.capitalizadoras = it));

    // this.capitalizadora = this.captalizadoraService.getCapitalizadora();
    this.carregarCapitalizadora();
    this.isEdit = false;
  }

  async carregarCapitalizadora() {
    try {
      const capitalizadoraReq =
        await this.supabaseService.buscarCapitalizadora();
      this.capitalizadora = capitalizadoraReq || [];
      console.log(this.capitalizadora[0].razao_social);
      this.cadastroForm
        .get("capitalizadora")
        ?.setValue(this.capitalizadora[0].id);
    } catch (error) {
      console.error("Erro ao carregar adiantamentos:", error);
    }
  }

  checkInvalidFields(): void {
    this.invalidFields = [];
    Object.keys(this.cadastroForm.controls).forEach((key) => {
      const control = this.cadastroForm.get(key);
      if (control && control.invalid && control.touched) {
        this.invalidFields.push(key);
      }
    });
  }

  onSubmit(): void {
    if (this.route.snapshot.paramMap.get("id")) {
      console.log("tenotu editar");
      this.editarDados();
      return;
    }

    if (this.cadastroForm.valid) {
      console.log("chegou");
      const formData = {
        ...this.cadastroForm.value,
        regulamento: this.regulamento.value,
      };
      this.supabaseService
        .insertCadastroSorteio(formData, "sorteio")
        .subscribe((it) => {
          if (it.error) {
            this.openError(true);
          } else {
            this.open(true);
          }
        });
      console.log("Formulário enviado:", formData);
    } else {
      this.checkInvalidFields();
    }
  }

  editarDados() {
    const edicao = this.route.snapshot.paramMap.get("id")?.trim();
    if (this.cadastroForm.valid) {
      const formData = {
        ...this.cadastroForm.value,
        regulamento: this.regulamento.value,
      };

      console.log(formData);
      this.supabaseService
        .editarCadastroSorteio(
          formData,
          "sorteio",
          edicao,
          this.cadastroForm.get("produto")?.value
        )
        .subscribe((it) => {
          if (it.error) {
            this.openError(true);
          } else {
            this.open(true);
          }
        });

      console.log("Formulário enviado:", formData);
    } else {
      this.checkInvalidFields();
    }
  }

  protected open(hasBackdrop: boolean) {
    this.dialogService.open(SucessReqComponent, { hasBackdrop });
  }

  protected openError(hasBackdrop: boolean) {
    this.dialogService.open(ErrorReqComponent, { hasBackdrop });
  }

  gerarPDF(): void {
    const doc = new jsPDF();

    const form = this.cadastroForm.value;

    const getLabel = (key: string, fallback = "-") => {
      switch (key) {
        case "id_influencer":
          return (
            this.influencers.find((inf: any) => inf.id === form.id_influencer)
              ?.nome_completo || fallback
          );
        case "id_entidade":
          return (
            this.entidades.find((ent: any) => ent.id === form.id_entidade)
              ?.razao_social || fallback
          );
        case "id_sistema":
          return (
            this.integradoraSistema.find(
              (sist: any) => sist.id === form.id_sistema
            )?.razao_social || fallback
          );
        case "id_banco":
          return (
            this.integradoras.find((b: any) => b.id === form.id_banco)
              ?.razao_social || fallback
          );
        case "capitalizadora":
          return (
            this.capitalizadoras.find((c: any) => c.id === form.capitalizadora)
              ?.razao_social || fallback
          );
        default:
          return form[key] ?? fallback;
      }
    };

    // Data atual formatada
    const dataGeracao = new Date().toLocaleDateString("pt-BR");

    doc.setFontSize(18);
    doc.text("Detalhes do Sorteio", 14, 15);

    doc.setFontSize(11);
    doc.text(`Data de geração: ${dataGeracao}`, 14, 22);
    doc.text(`Data do Sorteio: ${form.data_sorteio || "-"}`, 14, 28);
    doc.text(`Produto: ${form.produto || "-"}`, 14, 34);
    doc.text(`Edição: ${form.edicao || "-"}`, 14, 40);

    const data = [
      ["Edição", form.edicao],
      ["Data do Sorteio", form.data_sorteio],
      ["Processo SUSEPE", form.processo_susepe],
      ["Prêmio Principal", form.premio_principal],
      ["Série", form.serie],
      ["Tipo de Sorteio", form.tipo_sorteio],
      ["Venda Mínima", form.venda_minima],
      ["Cota Sorteio", form.cota_sorteio],
      ["Data de Carregamento", form.data_carregamento],
      ["Data de Resgate", form.data_resgate],
      ["Premiação Bruta", form.premiacao_bruta],
      ["Produto", form.produto],
      ["Valor de Venda do Título", form.valor_venda_titulo],
      ["Data Início de Vendas", form.data_inicio_vendas],
      ["Capital Mínimo", form.capital_minimo],
      ["Cota de Carregamento", form.cota_carregamento],
      ["Cota de Resgate", form.cota_resgate],
      ["Nome do Processo", form.nome_processo],
      ["Banco (Integradora)", getLabel("id_banco")],
      ["Sistema", getLabel("id_sistema")],
      ["Entidade", getLabel("id_entidade")],
      ["Influencer", getLabel("id_influencer")],
      ["Capitalizadora", form.capitalizadora],
      ["Observação Integradora", form.obs_integradora],
      ["Observação Capitalizadora", form.obs_capitalizadora],
      ["Data Real", form.data_real],
      ["Regulamento", this.regulamento.value || "-"],
    ];

    autoTable(doc, {
      head: [["Campo", "Valor"]],
      body: data,
      startY: 48,
      styles: { cellPadding: 2, fontSize: 10 },
      headStyles: { fillColor: [40, 40, 40], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`sorteio_${form.edicao || "detalhes"}.pdf`);
  }
}
