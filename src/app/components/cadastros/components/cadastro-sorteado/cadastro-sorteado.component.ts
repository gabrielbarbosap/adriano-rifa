import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NbDialogService } from "@nebular/theme";
import jsPDF from "jspdf";
import { ErrorReqComponent } from "src/app/components/error-req/error-req.component";
import { SucessReqComponent } from "src/app/components/sucess-req/sucess-req.component";
import { SupabaseService } from "src/app/service/supabase.service";
import { cpfValidator } from "src/app/service/validatorCpf";

@Component({
  selector: "app-cadastro-sorteado",
  templateUrl: "./cadastro-sorteado.component.html",
  styleUrls: ["./cadastro-sorteado.component.scss"],
})
export class CadastroSorteadoComponent implements OnInit {
  @Output() clickCadastro = new EventEmitter<string>();

  cadastroForm: FormGroup;
  error = false;
  // Armazenando múltiplos arquivos por tipo de documento
  uploadedFiles: { [key: string]: File[] } = {};
  uploadedFilesBase64: { [key: string]: string[] } = {};
  invalidFields: string[] = [];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private dialogService: NbDialogService,
    private route: ActivatedRoute
  ) {
    this.cadastroForm = this.fb.group({
      produto: ["", Validators.required],
      dataSorteio: ["", Validators.required],
      numeroTitulo: ["", Validators.required],
      valorLiquido: ["", Validators.required],
      dataGeracao: ["", Validators.required],
      cpf: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          cpfValidator(),
        ],
      ],
      dataNascimento: ["", Validators.required],
      nomeSocial: [""],
      nomeCompleto: ["", Validators.required],
      profissao: ["", Validators.required],
      renda: ["", Validators.required],
      formaPagamento: ["", Validators.required],
      tipoConta: ["", Validators.required],
      banco: ["", Validators.required],
      agencia: ["", Validators.required],
      conta: ["", Validators.required],
      numeroRegistro: ["", Validators.required],
      dataEmissaoRegistro: ["", Validators.required],
      orgaoEmissorRegistro: ["", Validators.required],
      cep: ["", Validators.required],
      uf: ["", [Validators.required, Validators.maxLength(2)]],
      cidade: ["", Validators.required],
      endereco: ["", Validators.required],
      numeroEndereco: ["", Validators.required],
      complemento: [""],
      bairro: ["", Validators.required],
      tipoTelefone: ["", Validators.required],
      ddd: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      numeroTelefone: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      aceitaComunicacao: [""],
      opcao_premio: ["", Validators.required],
    });
  }

  ngOnInit(): void {
    const sorteioId = localStorage.getItem("id_sorteado");
    if (sorteioId) {
      this.supabaseService.getSorteadoById(sorteioId).subscribe((data) => {
        if (data) {
          this.preencherFormulario(data); // Preenche o formulário com o primeiro item
        }
      });
    }
  }

  preencherFormulario(data: any) {
    this.cadastroForm.patchValue({
      produto: data.produto,
      dataSorteio: data.data_sorteio,
      numeroTitulo: data.numero_titulo,
      valorLiquido: data.valor_liquido,
      dataGeracao: data.data_geracao,
      cpf: data.cpf,
      dataNascimento: data.data_nascimento,
      nomeSocial: data.nome_social || "",
      nomeCompleto: data.nome_completo,
      profissao: data.profissao,
      renda: data.renda,
      formaPagamento: data.forma_pagamento,
      tipoConta: data.tipo_conta,
      banco: data.banco,
      agencia: data.agencia,
      conta: data.conta,
      numeroRegistro: data.numero_registro,
      dataEmissaoRegistro: data.data_emissao_registro,
      orgaoEmissorRegistro: data.orgao_emissor_registro,
      cep: data.cep,
      uf: data.uf,
      cidade: data.cidade,
      endereco: data.endereco,
      numeroEndereco: data.numero_endereco,
      complemento: data.complemento || "",
      bairro: data.bairro,
      tipoTelefone: data.tipo_telefone,
      ddd: data.ddd,
      numeroTelefone: data.numero_telefone,
      email: data.email,
      aceitaComunicacao: data.aceita_comunicacao,
      opcao_premio: data.opcao_premio,
    });
  }

  // Função de exportar PDF
  exportPDF(): void {
    const doc = new jsPDF();
    const formData = this.cadastroForm.value;

    // Adiciona título ao PDF
    doc.setFontSize(18);
    doc.text("Cadastro do Sorteado", 10, 10);

    doc.setFontSize(12);
    let yPosition = 20; // Posição inicial no PDF

    // Itera sobre os dados do formulário e os adiciona ao PDF
    for (const [key, value] of Object.entries(formData)) {
      doc.text(`${this.formatKey(key)}: ${value}`, 10, yPosition);
      yPosition += 10; // Incrementa a posição vertical
    }

    // Se houver documentos carregados, adicionar os nomes ao PDF
    if (Object.keys(this.uploadedFiles).length > 0) {
      doc.text("Documentos Anexados:", 10, yPosition);
      yPosition += 10;

      for (const fileType in this.uploadedFiles) {
        if (this.uploadedFiles[fileType]) {
          for (const file of this.uploadedFiles[fileType]) {
            doc.text(`${fileType}: ${file.name}`, 10, yPosition);
            yPosition += 10;
          }
        }
      }
    }

    // Salva o PDF
    doc.save("cadastro_sorteado.pdf");
  }

  formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, " $1") // Adiciona espaços antes de maiúsculas
      .replace(/^./, (str) => str.toUpperCase()); // Capitaliza a primeira letra
  }

  // Trigger o hidden file input click
  triggerFileInput(inputId: string): void {
    const fileInput = document.getElementById(inputId) as HTMLInputElement;
    fileInput.click();
  }

  // Handle multiple file selection and convert them to Base64
  onFilesSelected(event: Event, fileType: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      if (!this.uploadedFiles[fileType]) {
        this.uploadedFiles[fileType] = [];
        this.uploadedFilesBase64[fileType] = [];
      }

      // Processa todos os arquivos selecionados
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        this.uploadedFiles[fileType].push(file);
        this.convertFileToBase64(file, fileType);
      }
    }
  }

  // Converter arquivo para base64
  convertFileToBase64(file: File, fileType: string): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      this.uploadedFilesBase64[fileType].push(base64String);
    };
    reader.onerror = (error) => {
      console.error("Erro ao converter o arquivo para base64", error);
    };
    reader.readAsDataURL(file); // Converte o arquivo para base64
  }

  // Remove um arquivo da lista
  removeFile(fileType: string, index: number): void {
    if (this.uploadedFiles[fileType]) {
      this.uploadedFiles[fileType].splice(index, 1);
      this.uploadedFilesBase64[fileType].splice(index, 1); // Remove a versão base64
    }
  }

  // Checa campos inválidos e exibe uma mensagem de erro
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
      const formData = this.cadastroForm.value;

      const edicao = this.route.snapshot.paramMap.get("id")?.trim();

      const dataToSend = {
        ...formData,
        documentos: this.uploadedFilesBase64,
        edicao,
      };
      this.supabaseService
        .insertCadastroSorteado(dataToSend, "sorteio_ganhadores")
        .subscribe((it) => {
          if (it.error) {
            this.openError(true);
          } else {
            this.open(true);
            this.clickCadastro.emit("clicou");
          }
        });
      console.log("Formulário enviado:", dataToSend);
    } else {
      this.checkInvalidFields();
    }
  }

  editarDados() {
    if (this.cadastroForm.valid) {
      const formData = this.cadastroForm.value;

      const edicao = this.route.snapshot.paramMap.get("id")?.trim();

      const dataToSend = {
        ...formData,
        documentos: this.uploadedFilesBase64,
        edicao,
      };
      this.supabaseService
        .editCadastroSorteado(dataToSend, "sorteio_ganhadores")
        .subscribe((it) => {
          if (it.error) {
            this.openError(true);
          } else {
            this.open(true);
            this.clickCadastro.emit("clicou");
          }
        });
      console.log("Formulário enviado:", dataToSend);
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
}
