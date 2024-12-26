import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-cadastros",
  templateUrl: "./cadastros.component.html",
  styleUrls: ["./cadastros.component.scss"],
})
export class CadastrosComponent implements OnInit {
  clickDesenv = false;

  cadastrados = [
    "Gabriel",
    "Aziel",
    "Gabriel",
    "Aziel",
    "Gabriel",
    "Aziel",
    "Gabriel",
    "Aziel",
    "Gabriel",
    "Aziel",
  ];

  ngOnInit(): void {
    localStorage.removeItem("edicao");
    localStorage.removeItem("id_sorteado");
    localStorage.removeItem("id_influencer");
    localStorage.removeItem("id_sorteio");
  }

  clickToDesenv() {
    this.clickDesenv = true;
    setTimeout(() => {
      this.clickDesenv = false;
    }, 3000);
  }
}
