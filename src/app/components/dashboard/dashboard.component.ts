import { Component, OnInit } from "@angular/core";
import { NbDialogService } from "@nebular/theme";
import { BackdropClickDialogComponent } from "../backdrop-click-dialog/backdrop-click-dialog.component";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  constructor(private dialogService: NbDialogService) {}

  ngOnInit(): void {
    if (!localStorage.getItem("capitalizadora")) {
      this.openWithoutBackdropClick();
    }
  }

  openWithoutBackdropClick() {
    this.open(false);
  }

  protected open(closeOnBackdropClick: boolean) {
    this.dialogService.open(BackdropClickDialogComponent, {
      closeOnBackdropClick,
    });
  }
}
