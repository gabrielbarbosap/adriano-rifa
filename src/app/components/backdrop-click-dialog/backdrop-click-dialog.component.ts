import { Component, OnInit } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";
import { CapitalizadoraService } from "src/app/service/capitalizadora.service";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-backdrop-click-dialog",
  templateUrl: "./backdrop-click-dialog.component.html",
  styleUrls: ["./backdrop-click-dialog.component.scss"],
})
export class BackdropClickDialogComponent implements OnInit {
  capitalizadoras: any;

  selectedCapitalizadora: string = "";
  textInit = "";
  constructor(
    protected ref: NbDialogRef<BackdropClickDialogComponent>,
    private capitalizadoraService: CapitalizadoraService,
    private supabaseService: SupabaseService
  ) {
    this.selectedCapitalizadora = localStorage.getItem("capitalizadora") || "";
    this.selectedCapitalizadora
      ? (this.textInit = "Editar")
      : (this.textInit = "Escolha");
  }

  ngOnInit(): void {
    this.supabaseService
      .buscarDados("capitalizadoras")
      .subscribe((it) => (this.capitalizadoras = it));
  }

  // Submete o valor selecionado
  submit() {
    this.capitalizadoraService.setCapitalizadora(this.selectedCapitalizadora);

    this.ref.close(this.selectedCapitalizadora);
  }
}
