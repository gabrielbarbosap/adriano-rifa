import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-integradora-sistema",
  templateUrl: "./integradora-sistema.component.html",
  styleUrls: ["./integradora-sistema.component.scss"],
})
export class IntegradoraSistemaComponent {
  filtroForm: FormGroup;

  integradoras: any[] = [];
  integradorasFiltradas: any[] = [];
  integradorasPaginadas: any[] = [];

  cnpjs: string[] = [];
  razoesSociais: string[] = [];
  cidades: string[] = [];
  uf: string[] = [];

  paginaAtual = 1;
  itensPorPagina = 10;
  totalPaginas = 1;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService
  ) {
    this.filtroForm = this.fb.group({
      filtroCnpj: [""],
      filtroRazaoSocial: [""],
      filtroCidade: [""],
      filtroUf: [""],
    });
  }

  ngOnInit(): void {
    this.supabaseService.buscarDados("sistema").subscribe((it) => {
      this.integradoras = it;
      console.log(this.integradoras);

      this.cnpjs = this.integradoras.map(
        (capitalizadora) => capitalizadora.cnpj
      );
      this.razoesSociais = this.integradoras.map(
        (capitalizadora) => capitalizadora.razao_social
      );
      this.cidades = this.integradoras.map(
        (capitalizadora) => capitalizadora.cidade
      );

      this.uf = this.integradoras.map((capitalizadora) => capitalizadora.uf);

      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    const { filtroCnpj, filtroRazaoSocial, filtroCidade, filtroUf } =
      this.filtroForm.value;

    this.integradorasFiltradas = this.integradoras.filter((capitalizadora) => {
      return (
        (filtroCnpj ? capitalizadora.cnpj === filtroCnpj : true) &&
        (filtroRazaoSocial
          ? capitalizadora.razao_social === filtroRazaoSocial
          : true) &&
        (filtroCidade ? capitalizadora.cidade === filtroCidade : true) &&
        (filtroUf ? capitalizadora.uf === filtroUf : true)
      );
    });

    this.paginaAtual = 1;
    this.totalPaginas = Math.ceil(
      this.integradorasFiltradas.length / this.itensPorPagina
    );
    this.atualizarPaginacao();
  }

  limparFiltros(): void {
    this.filtroForm.reset({
      filtroCnpj: "",
      filtroRazaoSocial: "",
      filtroCidade: "",
      filtroUf: "",
    });

    this.aplicarFiltros();
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.integradorasPaginadas = this.integradorasFiltradas.slice(inicio, fim);
  }

  paginaAnterior(): void {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.atualizarPaginacao();
    }
  }

  proximaPagina(): void {
    if (this.paginaAtual < this.totalPaginas) {
      this.paginaAtual++;
      this.atualizarPaginacao();
    }
  }

  editarCapitalizadora(capitalizadora: any): void {
    console.log("Editando capitalizadora:", capitalizadora);
    // Redirecionar para a edição da capitalizadora
  }
}
