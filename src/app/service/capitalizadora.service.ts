import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CapitalizadoraService {
  private capitalizadoraSubject = new BehaviorSubject<string>(
    localStorage.getItem("capitalizadora") || ""
  );

  capitalizadora$ = this.capitalizadoraSubject.asObservable();

  constructor() {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  getCapitalizadora(): string {
    return localStorage.getItem("capitalizadora") || "";
  }

  setCapitalizadora(capitalizadora: string) {
    localStorage.setItem("capitalizadora", capitalizadora);
    this.capitalizadoraSubject.next(capitalizadora); // Atualiza o BehaviorSubject
  }

  storageEventListener(event: StorageEvent) {
    if (event.key === "capitalizadora") {
      this.capitalizadoraSubject.next(
        localStorage.getItem("capitalizadora") || ""
      );
    }
  }
}
