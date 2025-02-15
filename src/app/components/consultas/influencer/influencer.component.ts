import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-influencer",
  templateUrl: "./influencer.component.html",
  styleUrls: ["./influencer.component.scss"],
})
export class ConsultaInfluencerComponent implements OnInit {
  filtroForm: FormGroup;
  influencers: any[] = [];
  influencersFiltrados: any[] = [];
  influencersPaginados: any[] = [];
  paginaAtual = 1;
  itensPorPagina = 10;
  totalPaginas = 1;

  meses = [
    { numero: 1, nome: "Janeiro" },
    { numero: 2, nome: "Fevereiro" },
    { numero: 3, nome: "Março" },
    { numero: 4, nome: "Abril" },
    { numero: 5, nome: "Maio" },
    { numero: 6, nome: "Junho" },
    { numero: 7, nome: "Julho" },
    { numero: 8, nome: "Agosto" },
    { numero: 9, nome: "Setembro" },
    { numero: 10, nome: "Outubro" },
    { numero: 11, nome: "Novembro" },
    { numero: 12, nome: "Dezembro" },
  ];

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      filtroCpf: [""],
      filtroNomeCompleto: [""],
      filtroUf: [""],
      filtroCidade: [""],
      filtroAtivo: [true], // Filtro de ativos/inativos
      filtroMesAniversario: [""], // Novo filtro por mês de aniversário
    });
  }

  ngOnInit(): void {
    this.supabaseService.buscarDados("influencer").subscribe((it) => {
      this.influencers = it;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    const {
      filtroCpf,
      filtroNomeCompleto,
      filtroUf,
      filtroCidade,
      filtroAtivo,
      filtroMesAniversario,
    } = this.filtroForm.value;

    console.log("Lista antes do filtro:", this.influencers);
    console.log("Valores dos filtros:", {
      filtroCpf,
      filtroNomeCompleto,
      filtroUf,
      filtroCidade,
      filtroAtivo,
      filtroMesAniversario,
    });

    this.influencersFiltrados = this.influencers.filter((influencer) => {
      const matchCpf =
        filtroCpf && filtroCpf.trim() !== ""
          ? influencer.cpf?.toString().includes(filtroCpf.trim())
          : true;

      const matchNomeCompleto =
        filtroNomeCompleto && filtroNomeCompleto.trim() !== ""
          ? influencer.nome_completo
              ?.toLowerCase()
              .includes(filtroNomeCompleto.trim().toLowerCase())
          : true;

      const matchFiltroUf =
        filtroUf && filtroUf.trim() !== ""
          ? influencer.uf?.toLowerCase().includes(filtroUf.trim().toLowerCase())
          : true;

      const matchFiltroCidade =
        filtroCidade && filtroCidade.trim() !== ""
          ? influencer.cidade
              ?.toLowerCase()
              .includes(filtroCidade.trim().toLowerCase())
          : true;

      const matchAtivo =
        filtroAtivo !== null && filtroAtivo !== undefined
          ? influencer.ativo === filtroAtivo
          : true; // Se não houver filtro, permite qualquer valor

      let matchMesAniversario = true;
      if (filtroMesAniversario) {
        const dataNascimento = influencer.data_nascimento?.trim();
        if (dataNascimento) {
          const data = new Date(dataNascimento);
          if (!isNaN(data.getTime())) {
            matchMesAniversario = data.getMonth() + 1 === filtroMesAniversario;
          } else {
            matchMesAniversario = false;
          }
        } else {
          matchMesAniversario = false;
        }
      }

      const resultadoFinal =
        matchCpf &&
        matchNomeCompleto &&
        matchFiltroUf &&
        matchFiltroCidade &&
        matchAtivo &&
        matchMesAniversario;

      return resultadoFinal;
    });

    this.paginaAtual = 1;
    this.totalPaginas = Math.ceil(
      this.influencersFiltrados.length / this.itensPorPagina
    );

    if (this.influencersFiltrados.length > 0) {
      this.atualizarPaginacao();
    }
  }

  limparFiltros(): void {
    this.filtroForm.reset({
      filtroCpf: "",
      filtroNomeCompleto: "",
      filtroUf: "",
      filtroCidade: "",
      filtroAtivo: true,
      filtroMesAniversario: "", // Reseta o filtro por mês de aniversário
    });

    this.aplicarFiltros();
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.influencersPaginados = this.influencersFiltrados.slice(inicio, fim);
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

  editarInfluencer(influencer: any): void {
    localStorage.setItem("id_influencer", influencer);
    this.router.navigate([`/editar-influencer`, influencer]);
  }

  deletarInfluencer(influencer: any): void {
    console.log("Deletando influencer:", influencer);
  }
}
