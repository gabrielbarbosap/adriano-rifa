import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-consulta-entidade",
  templateUrl: "./entidade.component.html",
  styleUrls: ["./entidade.component.scss"],
})
export class ConsultaEntidadeComponent {
  filtroForm: FormGroup;

  entidades: any[] = [];
  entidadesFiltradas: any[] = [];
  entidadesPaginadas: any[] = [];

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
    this.supabaseService.buscarDados("entidade").subscribe((it) => {
      this.entidades = it;
      console.log(this.entidades);

      this.cnpjs = this.entidades.map((entidade) => entidade.cnpj);
      this.razoesSociais = this.entidades.map(
        (entidade) => entidade.razao_social
      );
      this.cidades = this.entidades.map((entidade) => entidade.cidade);

      this.uf = this.entidades.map((entidade) => entidade.uf);

      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    const { filtroCnpj, filtroRazaoSocial, filtroCidade, filtroUf } =
      this.filtroForm.value;

    this.entidadesFiltradas = this.entidades.filter((capitalizadora) => {
      return (
        (filtroCidade ? capitalizadora.cidade === filtroCidade : true) &&
        (filtroUf ? capitalizadora.uf === filtroUf : true) &&
        (filtroRazaoSocial
          ? capitalizadora.razao_social === filtroRazaoSocial
          : true) &&
        (filtroCnpj ? capitalizadora.cnpj === filtroCnpj : true)
      );
    });

    this.paginaAtual = 1;
    this.totalPaginas = Math.ceil(
      this.entidadesFiltradas.length / this.itensPorPagina
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
    this.entidadesPaginadas = this.entidadesFiltradas.slice(inicio, fim);
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

  editarEntidade(capitalizadora: any): void {
    console.log("Editando capitalizadora:", capitalizadora);
    // Redirecionar para a edição da capitalizadora
  }
}
