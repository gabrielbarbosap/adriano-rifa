import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, Validators } from "@angular/forms";
import { SupabaseService } from "src/app/service/supabase.service";

@Component({
  selector: "app-titulos-premiados",
  templateUrl: "./titulos-premiados.component.html",
  styleUrls: ["./titulos-premiados.component.scss"],
})
export class TitulosPremiadosComponent implements OnInit {
  titulosPremiadosForm: FormGroup;
  premiados = [] as any;

  constructor(
    private fb: FormBuilder,
    private supabaseService: SupabaseService
  ) {
    this.titulosPremiadosForm = this.fb.group({
      titulos: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.carregarTitulosPremiados();
  }

  get titulos(): FormArray {
    return this.titulosPremiadosForm.get("titulos") as FormArray;
  }

  criarTitulo(
    id: number | null = null,
    numeroTitulo: string = "",
    valorPremiado: number = 0,
    fonte: string = "",
    pago: string = ""
  ): FormGroup {
    return this.fb.group({
      id: [id],
      numeroTitulo: [numeroTitulo, Validators.required],
      valorPremiado: [valorPremiado, Validators.required],
      fonte: [fonte],
      pago: [pago, Validators.required],
    });
  }

  async carregarTitulosPremiados() {
    try {
      const titulos = await this.supabaseService.buscarTitulosPremiados();
      this.premiados = titulos || [];
      this.preencherTitulosPremiados(this.premiados);
    } catch (error) {
      console.error("Erro ao carregar títulos premiados:", error);
    }
  }

  preencherTitulosPremiados(titulos: any[]) {
    this.titulos.clear();
    titulos.forEach((titulo) => {
      this.titulos.push(
        this.criarTitulo(
          titulo.id,
          titulo.titulo,
          titulo.valor,
          titulo.fonte,
          titulo.pago
        )
      );
    });
  }

  adicionarTitulo() {
    this.titulos.push(this.criarTitulo());
  }

  removerTitulo(index: number) {
    this.titulos.removeAt(index);
  }

  async salvarTitulos() {
    if (this.titulosPremiadosForm.valid) {
      const titulosForm = this.titulosPremiadosForm.value.titulos;

      try {
        // Processar cada título
        for (const titulo of titulosForm) {
          if (titulo.id) {
            // Atualizar título existente
            await this.supabaseService.atualizarTituloPremiado({
              id: titulo.id,
              titulo: titulo.numeroTitulo,
              valor: titulo.valorPremiado,
              fonte: titulo.fonte,
              pago: titulo.pago,
            });
          } else {
            // Inserir novo título
            await this.supabaseService.inserirTitulosPremiados([
              {
                titulo: titulo.numeroTitulo,
                valor: titulo.valorPremiado,
                fonte: titulo.fonte,
                pago: titulo.pago,
                id_sorteio: 22, // ID do sorteio fixo para exemplo
              },
            ]);
          }
        }

        console.log("Títulos salvos com sucesso.");
        this.carregarTitulosPremiados(); // Recarregar lista
      } catch (error) {
        console.error("Erro ao salvar títulos premiados:", error);
      }
    } else {
      this.titulosPremiadosForm.markAllAsTouched();
    }
  }
}
