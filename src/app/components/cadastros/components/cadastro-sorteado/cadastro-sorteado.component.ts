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
  sorteadoId: any;
  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private dialogService: NbDialogService,
    private route: ActivatedRoute
  ) {
    this.cadastroForm = this.fb.group({
      produto: [""],
      dataSorteio: [""],
      numeroTitulo: [""],
      valorLiquido: [""],
      dataGeracao: [""],
      cpf: ["", [cpfValidator()]], // você pode remover até o cpfValidator se quiser CPF opcional
      dataNascimento: [""],
      nomeSocial: [""],
      nomeCompleto: [""],
      profissao: [""],
      renda: [""],
      formaPagamento: [""],
      tipoConta: [""],
      banco: [""],
      agencia: [""],
      conta: [""],
      numeroRegistro: [""],
      dataEmissaoRegistro: [""],
      orgaoEmissorRegistro: [""],
      cep: [""],
      uf: [""],
      cidade: [""],
      endereco: [""],
      numeroEndereco: [""],
      complemento: [""],
      bairro: [""],
      tipoTelefone: [""],
      ddd: [""],
      numeroTelefone: [""],
      email: [""],
      aceitaComunicacao: [""],
      opcao_premio: [""],
    });
  }

  ngOnInit(): void {
    this.sorteadoId = localStorage.getItem("id_sorteado");
    if (this.sorteadoId) {
      this.supabaseService
        .getSorteadoById(this.sorteadoId)
        .subscribe((data) => {
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

    const fakeFile = (base64: string, name: string): File => {
      if (!base64 || typeof base64 !== "string") {
        throw new Error("Base64 inválido ou não fornecido");
      }

      const cleanedBase64 = base64.includes(",")
        ? base64
        : `data:image/jpeg;base64,${base64}`;

      const arr = cleanedBase64.split(",");
      if (arr.length !== 2) throw new Error("Base64 malformado");

      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch?.[1] || "image/jpeg";

      try {
        const bstr = atob(arr[1]);
        const u8arr = new Uint8Array(bstr.length);
        for (let i = 0; i < bstr.length; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }
        return new File([u8arr], name, { type: mime });
      } catch (error) {
        console.error("Erro ao decodificar base64:", error);
        throw new Error("Erro ao converter base64 para arquivo");
      }
    };

    // Função para parsear campo se vier como string de array
    const parseArrayBase64 = (value: any): string | null => {
      try {
        const arr = JSON.parse(value);
        return Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
      } catch {
        return null;
      }
    };

    const doc1 = parseArrayBase64(data.titulo_capitalizacao_frente);
    const doc2 = parseArrayBase64(data.documento_identificacao_foto);
    const doc3 = parseArrayBase64(data.comprovante_residencia);

    if (doc1) {
      this.uploadedFilesBase64["tituloCapitalizacaoFrente"] = [doc1];
      this.uploadedFiles["tituloCapitalizacaoFrente"] = [
        fakeFile(doc1, "titulo_capitalizacao_frente.jpg"),
      ];
    }
    if (doc2) {
      this.uploadedFilesBase64["documentoIdentificacaoFoto"] = [doc2];
      this.uploadedFiles["documentoIdentificacaoFoto"] = [
        fakeFile(doc2, "documento_identificacao.jpg"),
      ];
    }
    if (doc3) {
      this.uploadedFilesBase64["comprovanteResidencia"] = [doc3];
      this.uploadedFiles["comprovanteResidencia"] = [
        fakeFile(doc3, "comprovante_residencia.jpg"),
      ];
    }
  }

  exportPDF(): void {
    const doc = new jsPDF();
    const formData = this.cadastroForm.value;

    doc.setFontSize(18);
    doc.text("Cadastro do Sorteado", 105, 15, { align: "center" });
    doc.setDrawColor(150);
    doc.line(10, 18, 200, 18);

    let y = 25;

    // Exibe formulário em colunas
    const leftKeys = Object.keys(formData).slice(
      0,
      Math.ceil(Object.keys(formData).length / 2)
    );
    const rightKeys = Object.keys(formData).slice(
      Math.ceil(Object.keys(formData).length / 2)
    );
    const lineHeight = 7;

    leftKeys.forEach((key, i) =>
      doc.text(
        `${this.formatKey(key)}: ${formData[key]}`,
        10,
        y + i * lineHeight
      )
    );
    rightKeys.forEach((key, i) =>
      doc.text(
        `${this.formatKey(key)}: ${formData[key]}`,
        105,
        y + i * lineHeight
      )
    );

    y += Math.max(leftKeys.length, rightKeys.length) * lineHeight + 10;

    doc.setFontSize(14);
    doc.text("Documentos Anexados", 105, y, { align: "center" });
    y += 10;

    const insertImagePleasant = (
      label: string,
      base64: string,
      yStart: number
    ): Promise<number> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 160; // Largura desejada no PDF (em mm)
          const ratio = img.naturalHeight / img.naturalWidth;
          const width = maxWidth;
          const height = maxWidth * ratio;

          // Quebra de página se necessário
          if (yStart + height > 270) {
            doc.addPage();
            yStart = 20;
          }

          doc.setFontSize(12);
          doc.text(`${label}:`, 10, yStart);
          yStart += 5;

          doc.addImage(base64, "JPEG", 25, yStart, width, height); // Centraliza com margem esquerda 25
          resolve(yStart + height + 10);
        };

        img.onerror = () => {
          doc.text(`${label}: Erro ao carregar imagem.`, 10, yStart);
          resolve(yStart + 10);
        };

        img.src = base64;
      });
    };

    const exec = async () => {
      const docs = [
        {
          label: "Título de Capitalização (Frente)",
          key: "tituloCapitalizacaoFrente",
        },
        { label: "Documento com Foto", key: "documentoIdentificacaoFoto" },
        { label: "Comprovante de Residência", key: "comprovanteResidencia" },
      ];

      for (const docItem of docs) {
        const base64 = this.uploadedFilesBase64[docItem.key]?.[0];
        if (base64) {
          y = await insertImagePleasant(docItem.label, base64, y);
        } else {
          doc.text(`${docItem.label}: Documento não anexado.`, 10, y);
          y += 10;
        }
      }

      doc.save("cadastro_sorteado.pdf");
    };

    exec();
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
    if (this.sorteadoId) {
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
    console.log("outro");
    if (this.cadastroForm.valid) {
      console.log("outro dentro");

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
