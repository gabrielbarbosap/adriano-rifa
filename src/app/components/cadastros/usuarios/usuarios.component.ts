import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NbDialogService } from "@nebular/theme";
import { SupabaseService } from "src/app/service/supabase.service";
import { ErrorReqComponent } from "../../error-req/error-req.component";
import { SucessReqComponent } from "../../sucess-req/sucess-req.component";
import { Router } from "@angular/router";
@Component({
  selector: "app-usuarios",
  templateUrl: "./usuarios.component.html",
  styleUrls: ["./usuarios.component.scss"],
})
export class UsuariosComponent {
  cadastroForm: FormGroup;
  tiposUsuarios = [
    { id: 5, descricao: "Cadastramento" },
    { id: 4, descricao: "Cadastro e Consultas" },
    { id: 1, descricao: "Administração" },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private supabaseService: SupabaseService,
    private dialogService: NbDialogService
  ) {
    this.cadastroForm = this.fb.group({
      nome: ["", Validators.required],
      celular: ["", [Validators.required]],
      tipo_usuario: ["", Validators.required],
      senha: ["", Validators.required],
    });
  }

  onSubmit() {
    if (this.cadastroForm.valid) {
      this.insertUser();
    }
  }

  insertUser() {
    this.supabaseService
      .inserirUsuarios(this.cadastroForm.value)
      .subscribe((it) => {
        if (it.error) {
          this.openError(true);
        } else {
          this.open(true);
        }
      });

    console.log("Formulário enviado:", this.cadastroForm);
  }

  protected open(hasBackdrop: boolean) {
    this.dialogService.open(SucessReqComponent, { hasBackdrop });
  }

  protected openError(hasBackdrop: boolean) {
    this.dialogService.open(ErrorReqComponent, { hasBackdrop });
  }

  onExit() {
    this.router.navigate(["/"]); // Redireciona para a página inicial ou outra rota desejada
  }
}
