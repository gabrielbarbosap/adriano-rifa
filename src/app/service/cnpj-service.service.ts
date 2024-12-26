import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CnpjService {
  private baseUrl: string = "https://brasilapi.com.br/api/cnpj/v1/";

  constructor(private http: HttpClient) {}

  // Método para buscar informações da empresa usando o CNPJ
  consultarCnpj(cnpj: string): Observable<any> {
    const url = `${this.baseUrl}${cnpj}`;
    return this.http.get(url);
  }
}
