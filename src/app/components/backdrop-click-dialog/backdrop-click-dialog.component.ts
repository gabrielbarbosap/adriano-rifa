import { Component } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { CapitalizadoraService } from "src/app/service/capitalizadora.service";

@Component({
  selector: "app-backdrop-click-dialog",
  templateUrl: "./backdrop-click-dialog.component.html",
  styleUrls: ["./backdrop-click-dialog.component.scss"],
})
export class BackdropClickDialogComponent {
  capitalizadoras = ["Capemisa", "Kovr", "ApliCap", "ViaCap"];

  selectedCapitalizadora: string = "";
  textInit = "";
  constructor(
    protected ref: NbDialogRef<BackdropClickDialogComponent>,
    private capitalizadoraService: CapitalizadoraService
  ) {
    this.selectedCapitalizadora = localStorage.getItem("capitalizadora") || "";
    this.selectedCapitalizadora
      ? (this.textInit = "Editar")
      : (this.textInit = "Escolha");
  }

  // Submete o valor selecionado
  submit() {
    this.capitalizadoraService.setCapitalizadora(this.selectedCapitalizadora);

    this.ref.close(this.selectedCapitalizadora);
  }
}
