import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-sorteado",
  templateUrl: "./sorteado.component.html",
  styleUrls: ["./sorteado.component.scss"],
})
export class SorteadoComponent implements OnInit {
  @Output() clickCadastro = new EventEmitter<string>();
  @Output() editarSorteado = new EventEmitter<string>();

  sorteios: any[] = [];
  sorteiosFiltrados: any[] = [];
  sorteiosPaginados: any[] = [];

  paginaAtual = 1;
  itensPorPagina = 10;
  totalPaginas = 1;

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarSorteios();
  }

  carregarSorteios(): void {
    const edicaoId = this.route.snapshot.paramMap.get("id")?.trim();

    this.supabaseService.getSorteado().subscribe((it) => {
      // Se não for array, transforma em array com um único item
      const data = Array.isArray(it) ? it : [it];
      console.log(data);
      this.sorteios = data;
      this.sorteiosFiltrados = this.sorteios;
      console.log("Sorteios filtrados:", this.sorteios);

      this.calcularTotalPaginas();
      this.atualizarPaginacao();
    });
  }

  calcularTotalPaginas(): void {
    this.totalPaginas = Math.ceil(
      this.sorteiosFiltrados.length / this.itensPorPagina
    );
  }

  cadastroSorteado(): void {
    this.clickCadastro.emit("clicou");
  }

  atualizarPaginacao(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.sorteiosPaginados = this.sorteiosFiltrados.slice(inicio, fim);
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

  editarSorteio(sorteioId: any): void {
    localStorage.setItem("id_sorteado", sorteioId);
    this.editarSorteado.emit("clicou");
  }
}
