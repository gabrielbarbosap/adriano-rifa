import { Component } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "app-sucess-req",
  templateUrl: "./sucess-req.component.html",
  styleUrls: ["./sucess-req.component.scss"],
})
export class SucessReqComponent {
  constructor(protected ref: NbDialogRef<SucessReqComponent>) {}

  // Submete o valor selecionado
  submit() {
    this.ref.close();
  }
}
