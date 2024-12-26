import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  NbThemeModule,
  NbLayoutModule,
  NbMenuModule,
  NbCardModule,
  NbIconModule,
  NbButtonModule,
  NbListModule,
  NbInputModule,
  NbSelectModule,
  NbFormFieldModule,
  NbDatepickerModule,
  NbRadioModule,
  NbAlertModule,
  NbDialogModule,
  NbUserModule,
  NbContextMenuModule,
  NbTabsetModule,
  NbSpinnerModule,
  NbCheckboxModule,
} from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { HeaderComponent } from "./components/header/header.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { CadastrosComponent } from "./components/cadastros/cadastros.component";
import { CadastroSorteadoComponent } from "./components/cadastros/components/cadastro-sorteado/cadastro-sorteado.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DocumentosComponent } from "./components/documentos/documentos.component";
import { DeclaracaoResidenciaComponent } from "./components/documentos/componentes/declaracao-residencia/declaracao-residencia.component";
import { CadastroInfluencerComponent } from "./components/cadastros/components/cadastro-influencer/cadastro-influencer.component";
import { HttpClientModule } from "@angular/common/http";
import { SorteioComponent } from "./components/cadastros/components/sorteio/sorteio.component";
import { ConsultaSorteioComponent } from "./components/consultas/consulta-sorteio/consulta-sorteio.component";
import { EntidadeComponent } from "./components/cadastros/components/entidade/entidade.component";
import { IntegradoraComponent } from "./components/cadastros/components/integradora/integradora.component";
import { CapitalizadoraComponent } from "./components/cadastros/components/capitalizadora/capitalizadora.component";
import { IntegradoraPixComponent } from "./components/cadastros/components/integradora-pix/integradora-pix.component";
import { IntegradoraSistemaComponent } from "./components/consultas/integradora-sistema/integradora-sistema.component";
import { SorteadoComponent } from "./components/consultas/sorteado/sorteado.component";
import { ConsultaCapitalizadoraComponent } from "./components/consultas/capitalizadora/capitalizadora.component";
import { ConsultaEntidadeComponent } from "./components/consultas/entidade/entidade.component";
import { ConsultaIntegradoraPixComponent } from "./components/consultas/integradora-pix/integradora-pix.component";
import { ConsultaInfluencerComponent } from "./components/consultas/influencer/influencer.component";
import { BackdropClickDialogComponent } from "./components/backdrop-click-dialog/backdrop-click-dialog.component";
import { TitulosPremiadosComponent } from "./components/cadastros/components/titulos-premiados/titulos-premiados.component";
import { SucessReqComponent } from "./components/sucess-req/sucess-req.component";
import { LoginComponent } from "./components/login/login.component";
import { ErrorReqComponent } from "./components/error-req/error-req.component";
import { AdiantamentosComponent } from "./components/cadastros/components/adiantamentos/adiantamentos.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    DashboardComponent,
    CadastrosComponent,
    CadastroSorteadoComponent,
    DocumentosComponent,
    DeclaracaoResidenciaComponent,
    CadastroInfluencerComponent,
    SorteioComponent,
    EntidadeComponent,
    CapitalizadoraComponent,
    IntegradoraComponent,
    IntegradoraPixComponent,
    SorteadoComponent,
    ConsultaSorteioComponent,
    ConsultaEntidadeComponent,
    ConsultaIntegradoraPixComponent,
    ConsultaCapitalizadoraComponent,
    ConsultaInfluencerComponent,
    ConsultaIntegradoraPixComponent,
    IntegradoraSistemaComponent,
    BackdropClickDialogComponent,
    TitulosPremiadosComponent,
    SucessReqComponent,
    LoginComponent,
    ErrorReqComponent,
    AdiantamentosComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: "default" }),
    NbDialogModule.forRoot(),
    NbLayoutModule,
    NbEvaIconsModule,
    NbMenuModule.forRoot(),
    NbCardModule,
    NbIconModule,
    NbButtonModule,
    NbListModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    NbDatepickerModule.forRoot(),
    NbRadioModule,
    NbAlertModule,
    NbUserModule,
    NbContextMenuModule,
    NbTabsetModule,
    NbSpinnerModule,
    NbCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
