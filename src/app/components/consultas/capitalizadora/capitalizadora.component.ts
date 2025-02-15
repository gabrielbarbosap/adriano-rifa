import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-consulta-capitalizadora",
  templateUrl: "./capitalizadora.component.html",
  styleUrls: ["./capitalizadora.component.scss"],
})
export class ConsultaCapitalizadoraComponent {
  filtroForm: FormGroup;

  capitalizadoras: any[] = [];
  capitalizadorasFiltradas: any[] = [];
  capitalizadorasPaginadas: any[] = [];

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
    this.supabaseService.buscarDados("capitalizadoras").subscribe((it) => {
      this.capitalizadoras = it;
      console.log(this.capitalizadoras);

      this.cnpjs = this.capitalizadoras.map(
        (capitalizadora) => capitalizadora.cnpj
      );
      this.razoesSociais = this.capitalizadoras.map(
        (capitalizadora) => capitalizadora.razao_social
      );
      this.cidades = this.capitalizadoras.map(
        (capitalizadora) => capitalizadora.cidade
      );

      this.uf = this.capitalizadoras.map((capitalizadora) => capitalizadora.uf);

      this.aplicarFiltros();
    });
  }

  carregarCapitalizadoras(): void {
    // Inicializa as listas de CNPJs, Razões Sociais, e Cidades para os selects
    this.cnpjs = this.capitalizadoras.map(
      (capitalizadora) => capitalizadora.cnpj
    );
    this.razoesSociais = this.capitalizadoras.map(
      (capitalizadora) => capitalizadora.razao_social
    );
    this.cidades = this.capitalizadoras.map(
      (capitalizadora) => capitalizadora.cidade
    );

    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    const { filtroCnpj, filtroRazaoSocial, filtroCidade, filtroUf } =
      this.filtroForm.value;

    this.capitalizadorasFiltradas = this.capitalizadoras.filter(
      (capitalizadora) => {
        return (
          (filtroCnpj ? capitalizadora.cnpj === filtroCnpj : true) &&
          (filtroRazaoSocial
            ? capitalizadora.razao_social === filtroRazaoSocial
            : true) &&
          (filtroCidade ? capitalizadora.cidade === filtroCidade : true) &&
          (filtroUf ? capitalizadora.uf === filtroUf : true)
        );
      }
    );

    this.paginaAtual = 1;
    this.totalPaginas = Math.ceil(
      this.capitalizadorasFiltradas.length / this.itensPorPagina
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
    this.capitalizadorasPaginadas = this.capitalizadorasFiltradas.slice(
      inicio,
      fim
    );
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
