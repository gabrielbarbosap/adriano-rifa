import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = ""; // Variável para armazenar a mensagem de erro

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private supabaseService: SupabaseService
  ) {
    this.loginForm = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const username = this.loginForm.value.username;
      const password = this.loginForm.value.password;

      this.supabaseService.buscarLogin(username, password).subscribe(
        (result) => {
          if (result && result.length > 0) {
            localStorage.setItem("nome_usuario", result[0].nome);
            // Login bem-sucedido
            this.errorMessage = ""; // Limpa qualquer mensagem de erro anterior
            this.router.navigate(["/inicio"]);
          } else {
            // Mostra a mensagem de erro na tela
            this.errorMessage =
              "Usuário ou senha incorretos. Verifique suas credenciais.";
          }
        },
        (error) => {
          // Trata erros do Supabase e exibe na tela
          this.errorMessage =
            "Ocorreu um erro ao tentar fazer login. Tente novamente mais tarde.";
          console.error("Erro ao verificar login:", error.message);
        }
      );
    } else {
      this.errorMessage = "Por favor, preencha todos os campos corretamente.";
    }
  }
}
