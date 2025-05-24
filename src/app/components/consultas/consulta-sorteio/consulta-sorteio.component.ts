import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SupabaseService } from "src/app/service/supabase.service";
import { Router } from "@angular/router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Sorteio {
  edicao: string;
  data_sorteio: string;
  produto: string;
  premio_principal: string;
  id_influencer: string;
  nome_completo: string;
}

@Component({
  selector: "app-consulta-sorteio",
  templateUrl: "./consulta-sorteio.component.html",
  styleUrls: ["./consulta-sorteio.component.scss"],
})
export class ConsultaSorteioComponent {
  filtroForm: FormGroup;

  sorteios: Sorteio[] = [];
  sorteiosFiltrados: Sorteio[] = [];
  sorteiosPaginados: Sorteio[] = [];

  paginaAtual = 1;
  itensPorPagina = 10;
  totalPaginas = 1;

  produtos = ["Produto 1", "Produto 2", "Produto 3"]; // Simulação de produtos
  influencers: string[] = []; // Lista inicial de influenciadores reais

  influencersFiltrados: any[] = [...this.influencers]; // Lista filtrada para exibição no select

  constructor(
    private fb: FormBuilder,
    private supabase: SupabaseService,
    private router: Router
  ) {
    this.filtroForm = this.fb.group({
      filtroEdicao: [""],
      filtroData: [""],
      filtroProduto: [[]], // Agora é um array
      filtroPremio: [""],
      filtroInfluencer: [""], // Campo de texto para o filtro de influencer
      filtroInfluencerSelecionado: [""], // Campo de seleção do influencer
      filtroProdutoSelecionado: [""],
    });
  }

  ngOnInit(): void {
    this.supabase
      .buscarDadosPorCapitalizadora("view_sorteio_influencer")
      .subscribe((it) => {
        this.sorteios = it;
        this.aplicarFiltros();
      });
    this.supabase.buscarDados("influencer").subscribe((it) => {
      this.influencers = it;
      this.influencersFiltrados = this.influencers;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    const {
      filtroEdicao,
      filtroData,
      filtroProduto,
      filtroPremio,
      filtroInfluencerSelecionado,
      filtroProdutoSelecionado,
    } = this.filtroForm.value;

    console.log(filtroProdutoSelecionado);
    // Verifica se o "Selecionar Todos" foi escolhido
    const produtosFiltrados = filtroProduto.includes("all")
      ? this.produtos
      : filtroProduto;

    // Aplica os filtros
    this.sorteiosFiltrados = this.sorteios.filter((sorteio) => {
      console.log(sorteio);
      return (
        (filtroEdicao ? String(sorteio.edicao) === filtroEdicao : true) &&
        (filtroData ? sorteio.data_sorteio === filtroData : true) &&
        (produtosFiltrados.length > 0
          ? produtosFiltrados.includes(sorteio.produto)
          : true) &&
        (filtroPremio
          ? sorteio.premio_principal.includes(filtroPremio)
          : true) &&
        (filtroInfluencerSelecionado
          ? sorteio.nome_completo === filtroInfluencerSelecionado
          : true) &&
        (filtroProdutoSelecionado
          ? sorteio.produto.includes(filtroProdutoSelecionado)
          : true)
      );
    });

    this.paginaAtual = 1;
    this.totalPaginas = Math.ceil(
      this.sorteiosFiltrados.length / this.itensPorPagina
    );
    this.atualizarPaginacao();
  }

  limparFiltros(): void {
    // Reseta o formulário de filtros e garante que o campo de influencer também seja limpo
    this.filtroForm.reset({
      filtroEdicao: "",
      filtroData: "",
      filtroProduto: [],
      filtroPremio: "",
      filtroInfluencer: "", // Limpa o campo de input do influencer
      filtroInfluencerSelecionado: "", // Limpa o select do influencer
      filtroProdutoSelecionado: "",
    });

    // Restaura a lista completa de influenciadores no select
    this.influencersFiltrados = [...this.influencers];

    // Reaplica os filtros para mostrar todos os sorteios
    this.aplicarFiltros();
  }
  filtrarInfluencers(): void {
    const query = this.filtroForm.get("filtroInfluencer")?.value.toLowerCase();
    this.influencersFiltrados = this.influencers.filter((influencer) =>
      influencer.toLowerCase().includes(query)
    );
  }

  onSelectProduto(selected: string[]): void {
    // Verifica se o "Selecionar Todos" foi escolhido
    if (selected.includes("all")) {
      this.filtroForm.patchValue({
        filtroProduto: [...this.produtos], // Marca todos os produtos
      });
    } else {
      // Remove "Selecionar Todos" se o usuário desmarcar manualmente
      this.filtroForm.patchValue({
        filtroProduto: selected.filter((produto) => produto !== "all"),
      });
    }
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

  editarSorteio(sorteioId: any, idInfluencer: any): void {
    localStorage.setItem("edicao", sorteioId);
    this.router.navigate([`/editar-sorteio`, sorteioId, idInfluencer]);
  }

  gerarPDF(): void {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Relatório de Sorteios", 14, 15);

    const colunas = [
      "Edição",
      "Data Sorteio",
      "Produto",
      "Prêmio Principal",
      "Influencer",
      "Capitalizadora",
    ];

    const linhas = this.sorteiosFiltrados.map((sorteio) => [
      sorteio.edicao,
      sorteio.data_sorteio,
      sorteio.produto,
      sorteio.premio_principal,
      sorteio.nome_completo,
      (sorteio as any).razao_social || "-",
    ]);

    autoTable(doc, {
      head: [colunas],
      body: linhas,
      startY: 20,
      styles: { cellPadding: 2, fontSize: 10 },
      headStyles: { fillColor: [40, 40, 40], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("relatorio_sorteios.pdf");
  }
}
