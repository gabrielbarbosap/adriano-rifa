import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CnpjService } from "src/app/service/cnpj-service.service";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-entidade",
  templateUrl: "./entidade.component.html",
  styleUrls: ["./entidade.component.scss"],
})
export class EntidadeComponent {
  entidadeForm: FormGroup;
  invalidFields: string[] = [];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private cnpjService: CnpjService
  ) {
    this.entidadeForm = this.fb.group({
      cnpj: ["", [Validators.required, Validators.minLength(14)]],
      razao_social: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      nome_fantasia: ["", [Validators.required]],
      fone_fixo: ["", Validators.required],
      fone_movel: ["", Validators.required],
      contato: ["", Validators.required],
      email_contato_comercial: ["", [Validators.required, Validators.email]],
      celular_contato_comercial: ["", Validators.required],
      cep: ["", [Validators.required, Validators.maxLength(8)]],
      endereco: ["", Validators.required],
      bairro: ["", Validators.required],
      cidade: ["", Validators.required],
      uf: ["", [Validators.required, Validators.maxLength(2)]],
      numero: ["", Validators.required],
      complemento: [""],
      comissao: ["", Validators.required],
      obs: [""],
    });
  }

  ngOnInit(): void {
    // Listen for changes to update invalid fields list
    this.entidadeForm.statusChanges.subscribe(() => {
      this.checkInvalidFields();
    });
  }

  consultaCnpjCapitalizadora() {
    const cnpj = this.entidadeForm.get("cnpj")?.value;

    if (cnpj && cnpj.length === 14) {
      this.cnpjService.consultarCnpj(cnpj).subscribe(
        (dados) => {
          this.entidadeForm.patchValue({
            razao_social: dados.razao_social || "",
            nome_fantasia: dados.nome_fantasia || "",
            email: dados.email || "",
            fone_fixo: dados.ddd_telefone_1 || "",
            fone_movel: dados.ddd_telefone_2 || "",

            contato_comercial: dados.contato_comercial || "",
            email_contato_comercial: dados.email_contato_comercial || "",
            celular_contato_comercial: dados.celular_contato_comercial || "",

            contato_adm: dados.contato_adm || "",
            email_contato_adm: dados.email_contato_adm || "",
            celular_contato_adm: dados.celular_contato_adm || "",

            cep: dados.cep || "",
            endereco: dados.logradouro || "",
            numero: dados.numero || "",
            complemento: dados.complemento || "",
            bairro: dados.bairro || "",
            cidade: dados.municipio || "",
            uf: dados.uf || "",

            comissao: dados.comissao || "",
            obs: dados.obs || "",
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

  // Function to check invalid fields in the form
  checkInvalidFields(): void {
    this.invalidFields = [];
    Object.keys(this.entidadeForm.controls).forEach((key) => {
      const control = this.entidadeForm.get(key);
      if (control && control.invalid && control.touched) {
        this.invalidFields.push(key);
      }
    });
  }

  // Function to handle form submission
  onSubmit(): void {
    if (this.entidadeForm.valid) {
      const formData = this.entidadeForm.value;
      this.supabaseService.insertEntidade(formData, "entidade");
      console.log("Form Submitted", formData);
    } else {
      this.checkInvalidFields();
    }
  }
}
