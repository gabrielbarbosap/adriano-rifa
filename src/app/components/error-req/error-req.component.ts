import { Component } from "@angular/core";
import { NbDialogRef } from "@nebular/theme";

@Component({
  selector: "app-error-req",
  templateUrl: "./error-req.component.html",
  styleUrls: ["./error-req.component.scss"],
})
export class ErrorReqComponent {
  constructor(protected ref: NbDialogRef<ErrorReqComponent>) {}
  submit() {
    this.ref.close();
  }
}
