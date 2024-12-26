import { Injectable } from "@angular/core";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { from, map, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = "https://uijfinqsjmvprqgmrbgl.supabase.co"; // Substitua pelo seu URL do Supabase
    const supabaseKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpamZpbnFzam12cHJxZ21yYmdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUwMzQ2NzYsImV4cCI6MjA0MDYxMDY3Nn0.2-8M5MAPTuxVzi6AfmvGpD-r6SAjFPnduqrmoV2pzL8"; // Substitua pela sua API Key do Supabase

    this.supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // Desabilita a persistência de sessão
        autoRefreshToken: false, // Desabilita a atualização automática do token
      },
    });

    // Recuperar o token manualmente do localStorage
    const savedSession = localStorage.getItem("supabase.auth.token");
    if (savedSession) {
      const session = JSON.parse(savedSession);
      this.supabase.auth.setSession(session);
    }
  }

  // Método para salvar a sessão manualmente no localStorage
  saveSession(session: any) {
    localStorage.setItem("supabase.auth.token", JSON.stringify(session));
  }

  // Exemplo de login para salvar a sessão manualmente
  async login(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (data && data.session) {
      this.saveSession(data.session); // Salvar sessão manualmente
    }

    if (error) {
      throw new Error(`Erro ao fazer login: ${error.message}`);
    }
  }

  // Função para inserir dados no Supabase
  async insertInfluencer(data: any) {
    const { error } = await this.supabase.from("influencer").insert([
      {
        ativo: data.ativo,
        cpf: data.cpf,
        data_nascimento: data.data_nascimento,
        nome_completo: data.nome_completo,
        rg: data.rg || null, // Não obrigatório
        titulo_eleitor: data.titulo_eleitor || null, // Não obrigatório

        // Dados cadastrais pessoais
        cep: data.cep,
        endereco: data.endereco,
        numero: data.numero,
        complemento: data.complemento || null, // Não obrigatório
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        email: data.email,
        fone_fixo: data.fone_fixo || null, // Não obrigatório
        fone_movel: data.fone_movel,

        // Dados de contato
        contato: data.contato || null, // Não obrigatório
        telefone_contato: data.telefone_contato || null, // Não obrigatório
        email_contato: data.email_contato || null, // Não obrigatório
        celular_contato: data.celular_contato || null, // Não obrigatório

        // Dados da empresa
        cnpj: data.cnpj,
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,

        // Endereço da empresa
        cep_pj: data.cep_empresa,
        endereco_pj: data.endereco_pj,
        numero_pj: data.numero_pj,
        complemento_pj: data.complemento_pj || null, // Não obrigatório
        bairro_pj: data.bairro_pj,
        cidade_pj: data.cidade_pj,
        uf_pj: data.uf_pj,
        email_pj: data.email_pj,
        fone_pj: data.fone_pj || null, // Não obrigatório
        celular_pj: data.celular_pj || null, // Não obrigatório
        data_abertura: data.data_abertura,

        // Dados adicionais
        obs: data.obs || null, // Não obrigatório
        comissao: data.comissao,
        id_capitalizadora: data.id_capitalizadora,
        banco: data.banco,
        chave_pix: data.chave_pix,
        agencia: data.agencia,
        conta: data.conta,
        documentos: data.documentos,
      },
    ]);

    if (error) {
      throw new Error(`Erro ao inserir dados: ${error.message}`);
    }
  }

  async editInfluencer(data: any) {
    const { error } = await this.supabase
      .from("influencer")
      .update([
        {
          ativo: data.ativo,
          cpf: data.cpf,
          data_nascimento: data.data_nascimento,
          nome_completo: data.nome_completo,
          rg: data.rg || null, // Não obrigatório
          titulo_eleitor: data.titulo_eleitor || null, // Não obrigatório

          // Dados cadastrais pessoais
          cep: data.cep,
          endereco: data.endereco,
          numero: data.numero,
          complemento: data.complemento || null, // Não obrigatório
          bairro: data.bairro,
          cidade: data.cidade,
          uf: data.uf,
          email: data.email,
          fone_fixo: data.fone_fixo || null, // Não obrigatório
          fone_movel: data.fone_movel,

          // Dados de contato
          contato: data.contato || null, // Não obrigatório
          telefone_contato: data.telefone_contato || null, // Não obrigatório
          email_contato: data.email_contato || null, // Não obrigatório
          celular_contato: data.celular_contato || null, // Não obrigatório

          // Dados da empresa
          cnpj: data.cnpj,
          razao_social: data.razao_social,
          nome_fantasia: data.nome_fantasia,

          // Endereço da empresa
          cep_pj: data.cep_empresa,
          endereco_pj: data.endereco_pj,
          numero_pj: data.numero_pj,
          complemento_pj: data.complemento_pj || null, // Não obrigatório
          bairro_pj: data.bairro_pj,
          cidade_pj: data.cidade_pj,
          uf_pj: data.uf_pj,
          email_pj: data.email_pj,
          fone_pj: data.fone_pj || null, // Não obrigatório
          celular_pj: data.celular_pj || null, // Não obrigatório
          data_abertura: data.data_abertura,

          // Dados adicionais
          obs: data.obs || null, // Não obrigatório
          comissao: data.comissao,
          id_capitalizadora: data.id_capitalizadora,
          banco: data.banco,
          chave_pix: data.chave_pix,
          agencia: data.agencia,
          conta: data.conta,
          documentos: data.documentos,
        },
      ])
      .eq("id", localStorage.getItem("id_influencer"));
    if (error) {
      throw new Error(`Erro ao inserir dados: ${error.message}`);
    }
  }

  getSorteioById(id: string): Observable<any> {
    return from(
      this.supabase.from("sorteio").select("*").eq("edicao", id).single()
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message); // Tratar erros se houver
        }
        return response.data; // Retorna os dados do sorteio
      })
    );
  }

  buscarSocios(socio: any): Observable<any> {
    return from(
      this.supabase
        .from("influencer_socios")
        .select("*")
        .eq("id_influencer", socio)
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }
        return response.data;
      })
    );
  }

  getSorteadoById(id: string): Observable<any> {
    return from(
      this.supabase.from("sorteio_ganhadores").select("*").eq("id", id).single()
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message); // Tratar erros se houver
        }
        return response.data; // Retorna os dados do sorteio
      })
    );
  }

  getInfluencerById(id: string): Observable<any> {
    return from(
      this.supabase.from("influencer").select("*").eq("id", id).single()
    ).pipe(
      map((response) => {
        if (response.error) {
          throw new Error(response.error.message); // Tratar erros se houver
        }
        return response.data; // Retorna os dados do sorteio
      })
    );
  }

  buscarDados(table: any): Observable<any[]> {
    const sorteiosPromise = this.supabase.from(table).select("*");

    return from(
      sorteiosPromise.then(({ data, error }) => {
        if (error) {
          throw new Error(`Erro ao buscar dados: ${error.message}`);
        }
        return data || [];
      })
    );
  }

  buscarDadosPorCapitalizadora(table: any): Observable<any[]> {
    const sorteiosPromise = this.supabase
      .from(table)
      .select("*")
      .eq("razao_social", localStorage.getItem("capitalizadora"));

    return from(
      sorteiosPromise.then(({ data, error }) => {
        if (error) {
          throw new Error(`Erro ao buscar dados: ${error.message}`);
        }
        return data || [];
      })
    );
  }

  async insertCapitalizadora(data: any) {
    const { error } = await this.supabase.from("capitalizadoras").insert([
      {
        // Dados da empresa
        cnpj: data.cnpj,
        razao_social: data.razao_social,
        email: data.email,
        fone_fixo: data.fone_fixo,
        fone_movel: data.fone_movel,

        // Contato comercial
        contato: data.contato_comercial,
        email_contato_comercial: data.email_contato_comercial,
        celular_contato_comercial: data.celular_contato_comercial,

        // Contato administrativo
        contato_adm: data.contatoAdm,
        email_contato_adm: data.emailContatoAdm,
        celular_contato_adm: data.celularContatoAdm,

        // Endereço da empresa
        cep: data.cep,
        endereco: data.endereco,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        numero: data.numero,
        complemento: data.complemento || null, // Não obrigatório

        // Dados adicionais
        comissao_distribuidor: data.comissao_distribuidor,
        obs: data.obs || null, // Não obrigatório
      },
    ]);

    if (error) {
      throw new Error(`Erro ao inserir dados: ${error.message}`);
    }
  }

  async insertEntidade(data: any, nameTable: string) {
    const { error } = await this.supabase.from(nameTable).insert([
      {
        // Dados da empresa
        cnpj: data.cnpj,
        razao_social: data.razao_social,
        email: data.email,
        fone_fixo: data.fone_fixo,
        fone_movel: data.fone_movel,
        nome_fantasia: data.nome_fantasia,

        // Contato comercial
        contato: data.contato,
        email_contato: data.email_contato_comercial,
        celular_contato: data.celular_contato_comercial,

        // Endereço da empresa
        cep: data.cep,
        endereco: data.endereco,
        bairro: data.bairro,
        cidade: data.cidade,
        uf: data.uf,
        numero: data.numero,
        complemento: data.complemento || null, // Não obrigatório

        // Dados adicionais
        comissao: data.comissao,
        obs: data.obs || null, // Não obrigatório
      },
    ]);

    if (error) {
      throw new Error(`Erro ao inserir dados: ${error.message}`);
    }
  }

  insertCadastroSorteio(data: any, nameTable: string): Observable<any> {
    console.log("chegou");
    // Retorna um Observable usando `from` para transformar a Promise
    return from(
      this.supabase.from(nameTable).insert([
        {
          edicao: data.edicao,
          data_sorteio: data.data_sorteio,
          nome_processo: data.nome_processo,
          processo_susepe: data.processo_susepe,
          premio_principal: data.premio_principal,
          desc_titulo_premiado: data.desc_titulo_premiado,
          titulos_premiados: data.titulos_premiados || null, // Campo não obrigatório
          valor_venda_titulo: data.valor_venda_titulo,
          serie: data.serie,
          data_inicio_vendas: data.data_inicio_vendas,
          tipo_sorteio: data.tipo_sorteio,
          venda_minima: data.venda_minima,
          cota_sorteio: data.cota_sorteio,
          data_carregamento: data.data_carregamento,
          data_resgate: data.data_resgate,
          premiacao_bruta: data.premiacao_bruta,
          id_banco: data.id_banco,
          id_sistema: data.id_sistema, // Se tiver no formulário
          id_entidade: data.id_entidade,
          produto: data.produto,
          id_distribuidor: data.id_distribuidor,
          id_capitalizadora: data.id_capitalizadora,
          id_influencer: data.id_influencer,
          regulamento: data.regulamento, // Se tiver no formulário
          obs_integradora: data.obs_integradora,
          obs_capitalizadora: data.obs_capitalizadora,
          data_real: data.data_real,
          capital_minimo: data.capital_minimo,
          cota_carregamento: data.cota_carregamento,
          cota_resgate: data.cota_resgate,
        },
      ])
    );
  }

  editarCadastroSorteio(
    data: any,
    nameTable: string,
    edicao: any
  ): Observable<any> {
    // Retorna um Observable usando `from` para transformar a Promise
    return from(
      this.supabase
        .from(nameTable)
        .update([
          {
            edicao: data.edicao,
            data_sorteio: data.data_sorteio,
            nome_processo: data.nome_processo,
            processo_susepe: data.processo_susepe,
            premio_principal: data.premio_principal,
            desc_titulo_premiado: data.desc_titulo_premiado,
            titulos_premiados: data.titulos_premiados || null, // Campo não obrigatório
            valor_venda_titulo: data.valor_venda_titulo,
            serie: data.serie,
            data_inicio_vendas: data.data_inicio_vendas,
            tipo_sorteio: data.tipo_sorteio,
            venda_minima: data.venda_minima,
            cota_sorteio: data.cota_sorteio,
            data_carregamento: data.data_carregamento,
            data_resgate: data.data_resgate,
            premiacao_bruta: data.premiacao_bruta,
            id_banco: data.id_banco,
            id_sistema: data.id_sistema, // Se tiver no formulário
            id_entidade: data.id_entidade,
            produto: data.produto,
            id_distribuidor: data.id_distribuidor,
            id_capitalizadora: data.id_capitalizadora,
            id_influencer: data.id_influencer,
            regulamento: data.regulamento, // Se tiver no formulário
            obs_integradora: data.obs_integradora,
            obs_capitalizadora: data.obs_capitalizadora,
            data_real: data.data_real,
            capital_minimo: data.capital_minimo,
            cota_carregamento: data.cota_carregamento,
            cota_resgate: data.cota_resgate,
          },
        ])
        .eq("edicao", edicao)
    );
  }

  insertCadastroSorteado(data: any, nameTable: string): Observable<any> {
    // Retorna um Observable usando `from` para transformar a Promise
    return from(
      this.supabase.from(nameTable).insert([
        {
          produto: data.produto,
          data_sorteio: data.dataSorteio,
          numero_titulo: data.numeroTitulo,
          valor_liquido: data.valorLiquido,
          data_geracao: data.dataGeracao,
          cpf: data.cpf,
          data_nascimento: data.dataNascimento,
          nome_social: data.nomeSocial || null,
          nome_completo: data.nomeCompleto,
          profissao: data.profissao,
          renda: data.renda,
          forma_pagamento: data.formaPagamento,
          tipo_conta: data.tipoConta,
          banco: data.banco,
          agencia: data.agencia,
          conta: data.conta,
          numero_registro: data.numeroRegistro,
          data_emissao_registro: data.dataEmissaoRegistro,
          orgao_emissor_registro: data.orgaoEmissorRegistro,
          cep: data.cep,
          uf: data.uf,
          cidade: data.cidade,
          endereco: data.endereco,
          numero_endereco: data.numeroEndereco,
          complemento: data.complemento || null,
          bairro: data.bairro,
          tipo_telefone: data.tipoTelefone,
          ddd: data.ddd,
          numero_telefone: data.numeroTelefone,
          email: data.email,
          aceita_comunicacao: data.aceitaComunicacao,
          titulo_capitalizacao_frente:
            data.documentos.tituloCapitalizacaoFrente,
          documento_identificacao_foto:
            data.documentos.documentoIdentificacaoFoto,
          comprovante_residencia: data.documentos.comprovanteResidencia,
          id_sorteio: localStorage.getItem("edicao"),
          opcao_premio: data.opcao_premio,
        },
      ])
    );
  }

  editCadastroSorteado(data: any, nameTable: string): Observable<any> {
    // Retorna um Observable usando `from` para transformar a Promise
    return from(
      this.supabase
        .from(nameTable)
        .update([
          {
            produto: data.produto,
            data_sorteio: data.dataSorteio,
            numero_titulo: data.numeroTitulo,
            valor_liquido: data.valorLiquido,
            data_geracao: data.dataGeracao,
            cpf: data.cpf,
            data_nascimento: data.dataNascimento,
            nome_social: data.nomeSocial || null,
            nome_completo: data.nomeCompleto,
            profissao: data.profissao,
            renda: data.renda,
            forma_pagamento: data.formaPagamento,
            tipo_conta: data.tipoConta,
            banco: data.banco,
            agencia: data.agencia,
            conta: data.conta,
            numero_registro: data.numeroRegistro,
            data_emissao_registro: data.dataEmissaoRegistro,
            orgao_emissor_registro: data.orgaoEmissorRegistro,
            cep: data.cep,
            uf: data.uf,
            cidade: data.cidade,
            endereco: data.endereco,
            numero_endereco: data.numeroEndereco,
            complemento: data.complemento || null,
            bairro: data.bairro,
            tipo_telefone: data.tipoTelefone,
            ddd: data.ddd,
            numero_telefone: data.numeroTelefone,
            email: data.email,
            aceita_comunicacao: data.aceitaComunicacao,
            titulo_capitalizacao_frente:
              data.documentos.tituloCapitalizacaoFrente,
            documento_identificacao_foto:
              data.documentos.documentoIdentificacaoFoto,
            comprovante_residencia: data.documentos.comprovanteResidencia,
            id_sorteio: localStorage.getItem("edicao"),
            opcao_premio: data.opcao_premio,
          },
        ])
        .eq("id", localStorage.getItem("id_sorteado"))
    );
  }

  async buscarAdiantamentos() {
    const { data, error } = await this.supabase
      .from("sorteio_adiantamentos")
      .select("*")
      .eq("id_sorteio", localStorage.getItem("edicao"));
    if (error) throw error;
    return data;
  }

  // Inserir novos adiantamentos
  async inserirAdiantamento(adiantamento: any) {
    const { data, error } = await this.supabase
      .from("sorteio_adiantamentos")
      .insert([adiantamento]);
    if (error) throw error;
    return data;
  }

  // Atualizar adiantamento existente
  async atualizarAdiantamento(adiantamento: any) {
    const { data, error } = await this.supabase
      .from("sorteio_adiantamentos")
      .update(adiantamento)
      .eq("id", adiantamento.id);
    if (error) throw error;
    return data;
  }

  // Deletar adiantamento por ID
  async deletarAdiantamento(id: number) {
    const { data, error } = await this.supabase
      .from("sorteio_adiantamentos")
      .delete()
      .eq("id", id);
    if (error) throw error;
    return data;
  }

  async deletarSocio(id: number) {
    const { data, error } = await this.supabase
      .from("influencer_socios")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Erro ao deletar no banco de dados:", error);
      throw error;
    }
    return true;
  }

  async inserirTitulosPremiados(titulos: any[]) {
    const { data, error } = await this.supabase
      .from("sorteio_titulos_premiados")
      .insert(titulos);

    if (error) throw error;
    return data;
  }

  // Atualizar título premiado existente
  async atualizarTituloPremiado(titulo: any) {
    const { data, error } = await this.supabase
      .from("sorteio_titulos_premiados")
      .update(titulo)
      .eq("id", titulo.id);

    if (error) throw error;
    return data;
  }

  // Deletar título premiado por ID
  async deletarTituloPremiado(id: number) {
    const { data, error } = await this.supabase
      .from("sorteio_titulos_premiados")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return data;
  }

  // Buscar títulos premiados
  async buscarTitulosPremiados() {
    const { data, error } = await this.supabase
      .from("sorteio_titulos_premiados")
      .select("*");

    if (error) throw error;
    return data;
  }

  async existeSocio(id: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from("influencer_socios")
      .select("id")
      .eq("id", id)
      .single();

    if (error && error.code !== "PGRST116") {
      // Se o erro não for de "linha não encontrada", lançamos o erro
      console.error("Erro ao verificar sócio:", error);
      throw error;
    }

    return !!data; // Retorna true se o sócio existir, false caso contrário
  }

  async updateSocio(socio: any): Promise<void> {
    const { error } = await this.supabase
      .from("influencer_socios")
      .update(socio)
      .eq("id", socio.id);

    if (error) {
      console.error("Erro ao atualizar sócio:", error);
      throw error;
    }
  }

  async createSocio(socio: any): Promise<void> {
    const { error } = await this.supabase.from("influencer_socios").insert({
      ...socio,
      id_influencer: localStorage.getItem("id_influencer"),
    });

    if (error) {
      console.error("Erro ao criar sócio:", error);
      throw error;
    }
  }

  async saveSocio(socio: any) {
    const { data, error } = await this.supabase
      .from("influencer_socios")
      .insert({
        ...socio,
        id_influencer: localStorage.getItem("id_influencer"),
      });
    if (error) throw error;
    return data;
  }
}
