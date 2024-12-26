import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogService } from "@nebular/theme";
import { ErrorReqComponent } from "src/app/components/error-req/error-req.component";
import { SucessReqComponent } from "src/app/components/sucess-req/sucess-req.component";
import { CnpjService } from "src/app/service/cnpj-service.service";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-capitalizadora",
  templateUrl: "./capitalizadora.component.html",
  styleUrls: ["./capitalizadora.component.scss"],
})
export class CapitalizadoraComponent implements OnInit {
  capitalizadoraForm: FormGroup;
  invalidFields: string[] = [];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private cnpjService: CnpjService,
    private dialogService: NbDialogService
  ) {
    this.capitalizadoraForm = this.fb.group({
      cnpj: ["", [Validators.required, Validators.minLength(14)]],
      razao_social: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      fone_fixo: ["", Validators.required],
      fone_movel: ["", Validators.required],
      contato_comercial: ["", Validators.required],
      email_contato_comercial: ["", [Validators.required, Validators.email]],
      celular_contato_comercial: ["", Validators.required],
      contato_adm: ["", Validators.required],
      email_contato_adm: ["", [Validators.required, Validators.email]],
      celular_contato_adm: ["", Validators.required],
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
    this.capitalizadoraForm.statusChanges.subscribe(() => {
      this.checkInvalidFields();
    });
  }

  consultaCnpjCapitalizadora() {
    const cnpj = this.capitalizadoraForm.get("cnpj")?.value;

    if (cnpj && cnpj.length === 14) {
      this.cnpjService.consultarCnpj(cnpj).subscribe(
        (dados) => {
          this.capitalizadoraForm.patchValue({
            razao_social: dados.razao_social || "",
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
    Object.keys(this.capitalizadoraForm.controls).forEach((key) => {
      const control = this.capitalizadoraForm.get(key);
      if (control && control.invalid && control.touched) {
        this.invalidFields.push(key);
      }
    });
  }

  // Function to handle form submission
  onSubmit(): void {
    if (this.capitalizadoraForm.valid) {
      try {
        const formData = this.capitalizadoraForm.value;
        this.supabaseService.insertCapitalizadora(formData);
        console.log("Form Submitted", formData);
        this.open(true);
      } catch (error) {
        this.openError(true);
      }
    } else {
      this.checkInvalidFields();
    }
  }

  open(hasBackdrop: boolean) {
    this.dialogService.open(SucessReqComponent, { hasBackdrop });
  }

  openError(hasBackdrop: boolean) {
    this.dialogService.open(ErrorReqComponent, { hasBackdrop });
  }
}
