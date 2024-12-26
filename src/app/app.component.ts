import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { filter } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "adriano-admin";
  header = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Escuta as mudanças de rota e filtra para pegar apenas NavigationEnd
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        // Verifica a URL atual e oculta o header na rota de login
        this.header = event.url !== "/login";
      });
  }
}
