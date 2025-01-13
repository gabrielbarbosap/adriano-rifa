import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ErrorReqComponent } from "src/app/components/error-req/error-req.component";
import { SucessReqComponent } from "src/app/components/sucess-req/sucess-req.component";
import { CnpjService } from "src/app/service/cnpj-service.service";
import { SupabaseService } from "src/app/service/supabase.service";
import { NbDialogService } from "@nebular/theme";
import { cpfValidator } from "src/app/service/validatorCpf";

@Component({
  selector: "app-cadastro-influencer",
  templateUrl: "./cadastro-influencer.component.html",
  styleUrls: ["./cadastro-influencer.component.scss"],
})
export class CadastroInfluencerComponent {
  cadastroForm: FormGroup;
  invalidFields: string[] = []; // Array para armazenar campos inválidos
  capitalizadoras: any;

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
  ];

  constructor(
    private fb: FormBuilder,
    private cnpjService: CnpjService,
    private supabaseService: SupabaseService,
    private dialogService: NbDialogService
  ) {
    this.cadastroForm = this.fb.group({
      cpf: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          cpfValidator(),
        ],
      ],
      data_nascimento: ["", Validators.required],
      nome_completo: ["", Validators.required],
      rg: [""], // Não obrigatório
      titulo_eleitor: [""], // Não obrigatório

      // Dados cadastrais pessoais
      cep: [
        "",
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
      endereco: ["", Validators.required],
      numero: ["", Validators.required],
      complemento: [""], // Não obrigatório
      bairro: ["", Validators.required],
      cidade: ["", Validators.required],
      uf: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      email: ["", [Validators.required, Validators.email]],
      fone_fixo: [""], // Não obrigatório
      fone_movel: ["", Validators.required],

      // Dados de contato
      contato: [""], // Não obrigatório
      telefone_contato: [""], // Não obrigatório
      email_contato: [""], // Não obrigatório
      celular_contato: [""], // Não obrigatório

      // Dados da empresa
      cnpj: [
        "",
        [
          Validators.required,
          Validators.minLength(14),
          Validators.maxLength(14),
        ],
      ],
      razao_social: ["", Validators.required],
      nome_fantasia: ["", Validators.required],

      // Endereço da empresa
      cep_empresa: [
        "",
        [Validators.required, Validators.minLength(8), Validators.maxLength(8)],
      ],
      endereco_pj: ["", Validators.required],
      numero_pj: ["", Validators.required],
      complemento_pj: [""], // Não obrigatório
      bairro_pj: ["", Validators.required],
      cidade_pj: ["", Validators.required],
      uf_pj: [
        "",
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      email_pj: ["", [Validators.required, Validators.email]],
      fone_pj: [""], // Não obrigatório
      celular_pj: [""], // Não obrigatório
      data_abertura: ["", Validators.required],

      // Dados adicionais
      obs: [""], // Não obrigatório
      comissao: ["", Validators.required],
      id_capitalizadora: ["", Validators.required],
      banco: ["", Validators.required],
      chave_pix: ["", Validators.required],
      conta: ["", Validators.required],
      agencia: ["", Validators.required],
      documentos: this.fb.array([]),
      ativo: [false],

      // FormArray para sócios
      socios: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    const influencerId = localStorage.getItem("id_influencer");

    this.supabaseService
      .buscarDados("capitalizadoras")
      .subscribe((it) => (this.capitalizadoras = it));

    if (influencerId) {
      console.log("Carregando dados do influencer com ID:", influencerId);

      // Buscar os dados principais do influencer
      this.supabaseService.getInfluencerById(influencerId).subscribe((data) => {
        if (data) {
          console.log("Dados do influencer carregados:", data);
          this.preencherFormulario(data); // Preenche o formulário com os dados principais
        }
      });

      // Buscar os sócios do influencer na tabela `influencers_socios`
      this.supabaseService.buscarSocios(influencerId).subscribe((socios) => {
        if (socios && socios.length > 0) {
          console.log("Sócios carregados:", socios);
          this.preencherSocios(socios);
        } else {
          console.log("Nenhum sócio encontrado para este influencer.");
        }
      });
    }
  }

  preencherFormulario(data: any) {
    console.log(data);
    this.cadastroForm.patchValue({
      id: data.id,
      // Dados pessoais
      cpf: data.cpf,
      data_nascimento: data.data_nascimento,
      nome_completo: data.nome_completo,
      rg: data.rg || "", // Campo opcional
      titulo_eleitor: data.titulo_eleitor || "", // Campo opcional
      ativo: data.ativo,

      // Dados cadastrais pessoais
      cep: data.cep,
      endereco: data.endereco,
      numero: data.numero,
      complemento: data.complemento || "", // Campo opcional
      bairro: data.bairro,
      cidade: data.cidade,
      uf: data.uf,
      email: data.email,
      fone_fixo: "", // Não fornecido no `data`
      fone_movel: data.fone_movel,

      // Dados de contato
      contato: data.contato, // Não fornecido no `data`
      telefone_contato: data.telefone_contato, // Não fornecido no `data`
      email_contato: data.email_contato, // Não fornecido no `data`
      celular_contato: data.celular_contato, // Não fornecido no `data`

      // Dados da empresa
      cnpj: data.cnpj || "", // Não fornecido diretamente no exemplo
      razao_social: data.razao_social || "",
      nome_fantasia: data.nome_fantasia || "",

      // Endereço da empresa
      cep_empresa: data.cep_pj || "", // Não fornecido no exemplo
      endereco_pj: data.endereco_pj || "",
      numero_pj: data.numero_pj || "",
      complemento_pj: data.complemento_pj || "",
      bairro_pj: data.bairro_pj || "",
      cidade_pj: data.cidade_pj || "",
      uf_pj: data.uf_pj || "",
      email_pj: data.email_pj || "",
      fone_pj: data.fone_pj || "",
      celular_pj: data.celular_pj || "",
      data_abertura: data.data_abertura || "",

      // Dados adicionais
      obs: "", // Não fornecido no `data`
      comissao: data.comissao || "",
      id_capitalizadora: data.id_capitalizadora || "",
      banco: data.banco,
      chave_pix: data.chave_pix || "",
      conta: data.conta,
      agencia: data.agencia,
      documentos: data.documentos, // Presume-se que o `data.documentos` seja um array; ajustar conforme necessário
    });

    this.documentos.clear();

    if (data.documentos && data.documentos.length > 0) {
      data.documentos.forEach((doc: any) => {
        this.documentos.push(
          this.fb.group({
            descricao: [doc.descricao, Validators.required],
            arquivo: [doc.arquivo], // O Base64 para gerar o link
            isUploaded: [!!doc.arquivo], // Campo para controlar se é um arquivo já enviado
          })
        );
      });
    }
  }

  consultaCnpj() {
    const cnpj = this.cadastroForm.get("cnpj")?.value;

    if (cnpj && cnpj.length === 14) {
      this.cnpjService.consultarCnpj(cnpj).subscribe(
        (dados) => {
          this.cadastroForm.patchValue({
            razao_social: dados.razao_social || "",
            nome_fantasia: dados.nome_fantasia || "",
            cep_empresa: dados.cep || "",
            endereco_pj: dados.logradouro || "",
            numero_pj: dados.numero || "",
            complemento_pj: dados.complemento || "",
            bairro_pj: dados.bairro || "",
            cidade_pj: dados.municipio || "",
            uf_pj: dados.uf || "",
            email_pj: dados.email || "",
            fone_pj: dados.ddd_telefone_1 || "",
            data_abertura: dados.data_inicio_atividade,
          });
        },
        (erro) => {
          console.error("Erro ao consultar CNPJ:", erro);
        }
      );
    } else {
      console.warn("CNPJ inválido ou incompleto");
    }
  }

  // Verificar campos inválidos e exibir suas mensagens
  getInvalidFields() {
    this.invalidFields = [];
    const controls = this.cadastroForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        this.invalidFields.push(name); // Armazena os nomes dos campos inválidos
      }
    }
  }

  async editarDados() {
    const formData = this.cadastroForm.value;

    const influencer = localStorage.getItem("id_influencer");
    this.getInvalidFields(); // Atualiza a lista de campos inválidos
    if (this.cadastroForm.valid) {
      try {
        const formData = this.cadastroForm.value;

        const documentos = await Promise.all(
          formData.documentos.map(async (doc: any) => {
            if (doc.arquivo && typeof doc.arquivo !== "string") {
              // Converte apenas se o arquivo for válido e não já em Base64
              const base64File = await this.convertFileToBase64(doc.arquivo);
              return {
                descricao: doc.descricao,
                arquivo: base64File, // Arquivo convertido em Base64
              };
            } else {
              // Retorna o documento original caso o arquivo seja inválido ou já em Base64
              return {
                descricao: doc.descricao,
                arquivo: doc.arquivo || "", // Manter vazio caso não tenha arquivo
              };
            }
          })
        );

        const payload = {
          ...formData,
          documentos,
        };

        const result = await this.supabaseService.editInfluencer(payload);
        console.log("Dados inseridos com sucesso", result);
        this.open(true);
      } catch (error) {
        console.error("Erro ao inserir dados", error);
        this.openError(true);
      }
    } else {
      console.log("Campos inválidos: ", this.invalidFields);
    }
  }

  async onSubmit() {
    if (localStorage.getItem("id_influencer")) {
      console.log("tenotu editar");
      this.editarDados();
      return;
    }

    this.getInvalidFields(); // Atualiza a lista de campos inválidos
    if (this.cadastroForm.valid) {
      try {
        const formData = this.cadastroForm.value;

        // Converta os arquivos para Base64
        const documentos = await Promise.all(
          formData.documentos.map(async (doc: any) => {
            if (doc.arquivo && typeof doc.arquivo !== "string") {
              // Converte apenas se o arquivo for válido e não já em Base64
              const base64File = await this.convertFileToBase64(doc.arquivo);
              return {
                descricao: doc.descricao,
                arquivo: base64File, // Arquivo convertido em Base64
              };
            } else {
              // Retorna o documento original caso o arquivo seja inválido ou já em Base64
              return {
                descricao: doc.descricao,
                arquivo: doc.arquivo || "", // Manter vazio caso não tenha arquivo
              };
            }
          })
        );

        const payload = {
          ...formData,
          documentos,
        };

        const result = await this.supabaseService.insertInfluencer(payload);
        this.open(true);
        console.log("Dados inseridos com sucesso", result);
      } catch (error) {
        console.error("Erro ao inserir dados", error);
        this.openError(true);
      }
    } else {
      console.log("Campos inválidos: ", this.invalidFields);
    }
  }

  convertFileToBase64(file: File): Promise<string> {
    if (!(file instanceof Blob)) {
      // Retorna um erro ou valor padrão se o parâmetro não for válido
      return Promise.reject("O parâmetro não é um arquivo ou Blob válido.");
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }

  get documentos() {
    return this.cadastroForm.get("documentos") as FormArray;
  }

  // Adicionar um novo documento ao FormArray
  addDocumento() {
    const documentoForm = this.fb.group({
      arquivo: [null, Validators.required], // Será preenchido ao selecionar o arquivo
      descricao: ["", Validators.required], // Campo obrigatório
    });

    this.documentos.push(documentoForm);
  }

  // Remover um documento do FormArray
  removeDocumento(index: number) {
    this.documentos.removeAt(index);
  }

  onFileChange(event: Event, index: number) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.documentos.at(index).patchValue({
          arquivo: file, // Atualizar com o arquivo em si, não o resultado Base64 ainda
          isUploaded: false,
        });
      };
      reader.readAsDataURL(file); // Apenas para exibir uma pré-visualização se necessário
    } else {
      console.error("Nenhum arquivo válido foi selecionado.");
    }
  }

  openDocumento(base64: string, descricao: string) {
    try {
      // Obter os dados e o tipo do arquivo
      const [header, data] = base64.split(",");
      const mimeType =
        header.match(/data:(.*?);base64/)?.[1] || "application/octet-stream";

      // Decodificar Base64 para bytes
      const binaryData = atob(data);
      const byteArray = new Uint8Array(binaryData.length);
      for (let i = 0; i < binaryData.length; i++) {
        byteArray[i] = binaryData.charCodeAt(i);
      }

      // Criar um Blob com os dados
      const blob = new Blob([byteArray], { type: mimeType });

      // Criar URL e abrir em nova aba
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");

      // Liberar memória
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao abrir o documento:", error);
      alert("Não foi possível abrir o documento. Verifique o formato.");
    }
  }

  // Sócios: Métodos para gerenciar o FormArray de sócios

  get socios(): FormArray {
    return this.cadastroForm.get("socios") as FormArray;
  }

  // Adicionar um novo sócio ao FormArray
  addSocio() {
    const socioForm = this.fb.group({
      nome: ["", Validators.required],
      cpf: [
        "",
        [
          Validators.required,
          Validators.minLength(11),
          Validators.maxLength(11),
          cpfValidator(),
        ],
      ],
      data_nascimento: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      fone: ["", Validators.required],
      cep: ["", Validators.required],
      bairro: ["", Validators.required],
      complemento: ["", Validators.required],
      endereco: ["", Validators.required],
      uf: ["", Validators.required],
      cidade: ["", Validators.required],
    });

    this.socios.push(socioForm);
  }

  // Remover um sócio do FormArray
  async removeSocio(index: number, socio: any) {
    try {
      console.log(socio.value);
      const result = await this.supabaseService.deletarSocio(socio.value.id);
      if (result) {
        this.socios.removeAt(index); // Só remove do array se a chamada for bem-sucedida
      }
    } catch (error) {
      console.error("Erro ao deletar sócio:", error);
    }
  }

  preencherSocios(sociosData: any[]) {
    this.socios.clear();
    sociosData.forEach((socio) => {
      this.socios.push(
        this.fb.group({
          id: socio.id,
          nome: [socio.nome, Validators.required],
          cpf: [
            socio.cpf,
            [
              Validators.required,
              Validators.minLength(11),
              Validators.maxLength(14),
            ],
          ],
          data_nascimento: [socio.data_nascimento, Validators.required],
          email: [socio.email, [Validators.required, Validators.email]],
          fone: [socio.fone, Validators.required],
          cep: [socio.cep, Validators.required],
          bairro: [socio.bairro, Validators.required],
          complemento: [socio.complemento, Validators.required],
          endereco: [socio.endereco, Validators.required],
          uf: [socio.uf, Validators.required],
          cidade: [socio.cidade, Validators.required],
        })
      );
    });
  }

  async salvarSocios() {
    const socios = this.socios.value; // Obtém os dados dos sócios do FormArray
    console.log(socios);
    try {
      for (const socio of socios) {
        if (socio.id) {
          if (await this.supabaseService.existeSocio(socio.id)) {
            await this.supabaseService.updateSocio(socio);
          }
        } else {
          // Cria um novo sócio
          await this.supabaseService.createSocio(socio);
        }
      }
      console.log("Sócios processados com sucesso!");
      this.open(true); // Abre o diálogo de sucesso
    } catch (error) {
      console.error("Erro ao salvar os sócios:", error);
      this.openError(true); // Abre o diálogo de erro
    }
  }

  open(hasBackdrop: boolean) {
    this.dialogService.open(SucessReqComponent, { hasBackdrop });
  }

  openError(hasBackdrop: boolean) {
    this.dialogService.open(ErrorReqComponent, { hasBackdrop });
  }
}
