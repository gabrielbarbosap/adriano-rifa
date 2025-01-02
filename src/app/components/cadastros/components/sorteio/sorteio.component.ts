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

  items = [
    { title: "Sorteio" },
    { title: "Ganhadores" },
    { title: "Adiantamentos" },
    { title: "Financeiro" },
    { title: "Regulamento PSTC" },
    { title: "Números Premiados" },
  ];

  invalidFields: string[] = [];

  success = false;
  error = false;

  badgeText = "!";
  badgeStatus = "warning";
  constructor(
    private fb: FormBuilder,
    private nbMenuService: NbMenuService,
    private supabaseService: SupabaseService,
    private dialogService: NbDialogService,
    private route: ActivatedRoute
  ) {
    this.cadastroForm = this.fb.group({
      edicao: ["", Validators.required],
      data_sorteio: ["", Validators.required],
      nome_processo: ["", Validators.required],
      processo_susepe: ["", Validators.required],
      premio_principal: ["", Validators.required],
      titulos_premiados: [""],
      valor_venda_titulo: ["", Validators.required],
      serie: ["", Validators.required],
      data_inicio_vendas: ["", Validators.required],
      tipo_sorteio: ["", Validators.required],
      venda_minima: ["", Validators.required],
      cota_sorteio: ["", Validators.required],
      data_carregamento: [null, Validators.required],
      data_resgate: ["", Validators.required],
      premiacao_bruta: ["", Validators.required],
      id_banco: ["", Validators.required],
      id_capitalizadora: [null, Validators.required],
      id_entidade: [null, Validators.required],
      produto: ["", Validators.required],
      id_sistema: [, Validators.required],
      id_influencer: [null, Validators.required],
      obs_integradora: [null, Validators.required],
      obs_capitalizadora: [null, Validators.required],
      data_real: [null],
      capital_minimo: [null, Validators.required],
      cota_carregamento: [null, Validators.required],
      cota_resgate: [null, Validators.required],
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
    this.route.snapshot.paramMap.get("id")
      ? this.loadData()
      : this.capturarDados();

    this.cadastroForm.statusChanges.subscribe(() => {
      this.checkInvalidFields();
    });

    const sorteioId = this.route.snapshot.paramMap.get("id");
    if (sorteioId) {
      this.supabaseService.getSorteioById(sorteioId).subscribe((data) => {
        if (data) {
          this.cadastroForm.patchValue(data); // Preenche o formulário com os dados existentes
          this.regulamento.setValue(data.regulamento); // Define o regulamento, se houver
          localStorage.setItem("id_sorteio", data.id);
          this.isEdit = false;
          this.isEditTab = true;
        }
      });
    }
  }

  loadData() {
    this.isEdit = true;

    this.supabaseService
      .buscarDados("banco")
      .subscribe((it) => (this.integradoras = it));

    this.supabaseService
      .buscarDados("entidade")
      .subscribe((it) => (this.entidades = it));

    this.supabaseService
      .buscarDados("sistema")
      .subscribe((it) => (this.integradoraSistema = it));
  }

  clickCadastroSorteado() {
    console.log("clicou");
    this.cadastroSorteado = !this.cadastroSorteado;
  }

  capturarDados() {
    this.isEdit = false;

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
        .editarCadastroSorteio(formData, "sorteio", edicao)
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

  // Função para exportar os dados do formulário para PDF
  exportPDF(): void {
    // Aqui você pode implementar a lógica para exportar o formulário preenchido para PDF
    console.log("Exportar para PDF");
  }
}
