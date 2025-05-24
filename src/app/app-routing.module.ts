import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { CadastrosComponent } from "./components/cadastros/cadastros.component";
import { CadastroSorteadoComponent } from "./components/cadastros/components/cadastro-sorteado/cadastro-sorteado.component";
import { DocumentosComponent } from "./components/documentos/documentos.component";
import { DeclaracaoResidenciaComponent } from "./components/documentos/componentes/declaracao-residencia/declaracao-residencia.component";
import { CadastroInfluencerComponent } from "./components/cadastros/components/cadastro-influencer/cadastro-influencer.component";
import { SorteioComponent } from "./components/cadastros/components/sorteio/sorteio.component";
import { ConsultaSorteioComponent } from "./components/consultas/consulta-sorteio/consulta-sorteio.component";
import { CapitalizadoraComponent } from "./components/cadastros/components/capitalizadora/capitalizadora.component";
import { IntegradoraComponent } from "./components/cadastros/components/integradora/integradora.component";
import { ConsultaCapitalizadoraComponent } from "./components/consultas/capitalizadora/capitalizadora.component";
import { SorteadoComponent } from "./components/consultas/sorteado/sorteado.component";
import { ConsultaEntidadeComponent } from "./components/consultas/entidade/entidade.component";
import { ConsultaIntegradoraPixComponent } from "./components/consultas/integradora-pix/integradora-pix.component";
import { IntegradoraSistemaComponent } from "./components/consultas/integradora-sistema/integradora-sistema.component";
import { EntidadeComponent } from "./components/cadastros/components/entidade/entidade.component";
import { IntegradoraPixComponent } from "./components/cadastros/components/integradora-pix/integradora-pix.component";
import { ConsultaInfluencerComponent } from "./components/consultas/influencer/influencer.component";
import { LoginComponent } from "./components/login/login.component";
import { UsuariosComponent } from "./components/cadastros/usuarios/usuarios.component";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "inicio", component: DashboardComponent },
  { path: "dados", component: CadastrosComponent },
  { path: "documentos", component: DocumentosComponent },
  { path: "declaracao-residencia", component: DeclaracaoResidenciaComponent },
  { path: "cadastros-sorteado", component: CadastroSorteadoComponent },
  { path: "cadastros-capitalizadora", component: CapitalizadoraComponent },
  { path: "cadastros-integradora-sistema", component: IntegradoraComponent },
  { path: "cadastros-integradora-pix", component: IntegradoraPixComponent },
  { path: "cadastros-influencer", component: CadastroInfluencerComponent },
  { path: "cadastros-sorteio", component: SorteioComponent },
  { path: "cadastros-entidade", component: EntidadeComponent },
  { path: "cadastros-usuario", component: UsuariosComponent },
  {
    path: "consulta-integradora-sistema",
    component: IntegradoraSistemaComponent,
  },
  {
    path: "consulta-integradora-pix",
    component: ConsultaIntegradoraPixComponent,
  },
  { path: "consulta-entidade", component: ConsultaEntidadeComponent },
  { path: "consulta-sorteado", component: SorteadoComponent },
  { path: "consulta-sorteio", component: ConsultaSorteioComponent },
  { path: "consulta-influencer", component: ConsultaInfluencerComponent },
  {
    path: "consulta-capitalizadora",
    component: ConsultaCapitalizadoraComponent,
  },
  { path: "editar-sorteio/:id/:idInfluencer", component: SorteioComponent },
  { path: "editar-sorteado/:id", component: CadastroSorteadoComponent },
  { path: "editar-influencer/:id", component: CadastroInfluencerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
