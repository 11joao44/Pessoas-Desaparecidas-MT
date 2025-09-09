import axios from 'axios';
import placeholderImageM from '../assets/placeholder-m.svg';
import placeholderImageF from '../assets/placeholder-f.svg';

interface ApiPersonSummary {
  id: number;
  nome: string;
  idade: number;
  sexo: 'MASCULINO' | 'FEMININO' | string;
  urlFoto: string | null;
  ultimaOcorrencia: {
    dataLocalizacao: string | null;
  } | null;
}

export interface PersonDetails extends ApiPersonSummary {
  ultimaOcorrencia: {
    dtDesaparecimento: string | null;
    dataLocalizacao: string | null;
    localDesaparecimentoConcat: string | null;
    ocorrenciaEntrevDesapDTO: {
      informacao: string | null;
      vestimentasDesaparecido: string | null;
    } | null;
  } | null;
}

interface PaginatedApiResponse {
  content: ApiPersonSummary[];
  totalPages: number;
  totalElements: number;
}

export interface Statistics {
  quantPessoasDesaparecidas: number;
  quantPessoasEncontradas: number;
}

export interface NovaInformacaoPayload {
  ocoId: number;
  localizacao: string;
  observacoes: string;
  fotos: FileList | null;
}

export type Sexo = 'MASCULINO' | 'FEMININO' | '';
export type Status = 'DESAPARECIDO' | 'LOCALIZADO' | '';

export interface Person {
  id: number;
  nome: string;
  foto: string;
  status: 'Desaparecida' | 'Localizada';
  sexo: 'MASCULINO' | 'FEMININO';
}

export interface PaginatedResponse {
  content: Person[];
  totalPages: number;
  totalElements: number;
}

export interface FiltrosBusca {
  page?: number;
  searchTerm?: string;
  idadeInicial?: number;
  idadeFinal?: number;
  sexo?: Sexo;
  status?: Status;
}

export const api = axios.create({
  baseURL: 'https://abitus-api.geia.vip/v1',
});

export const buscarPessoasPorFiltro = async (
  filtros: FiltrosBusca = {},
): Promise<PaginatedResponse> => {
  try {
    const {
      page = 1,
      searchTerm = '',
      idadeInicial = 0,
      idadeFinal = 0,
      sexo = '',
      status = '',
    } = filtros;

    const response = await api.get<PaginatedApiResponse>('/pessoas/aberto/filtro', {
      params: {
        pagina: page - 1,
        porPagina: 12,
        nome: searchTerm || undefined,
        faixaIdadeInicial: idadeInicial || undefined,
        faixaIdadeFinal: idadeFinal || undefined,
        sexo: sexo || undefined,
        status: status || undefined,
      },
    });
    const apiData = response.data;

    const transformedContent: Person[] = apiData.content.map((p) => ({
      id: p.id,
      nome: p.nome,
      foto: p.urlFoto ?? (p.sexo === 'MASCULINO' ? placeholderImageM : placeholderImageF),
      status: p.ultimaOcorrencia?.dataLocalizacao ? 'Localizada' : 'Desaparecida',
      sexo: p.sexo === 'MASCULINO' ? 'MASCULINO' : 'FEMININO',
    }));

    return {
      content: transformedContent,
      totalPages: apiData.totalPages,
      totalElements: apiData.totalElements,
    };
  } catch (error) {
    console.error('Erro ao buscar dados da API:', error);
    throw new Error('Não foi possível carregar a lista de pessoas.');
  }
};

export const buscarPessoaPorId = async (id: string): Promise<PersonDetails> => {
  try {
    const response = await api.get<PersonDetails>(`/pessoas/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar detalhes para a pessoa com ID ${id}:`, error);
    throw new Error('Não foi possível carregar os detalhes da pessoa.');
  }
};

export const buscarPorEstatisticas = async (): Promise<Statistics> => {
  try {
    const response = await api.get<Statistics>('/pessoas/aberto/estatistico');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw new Error('Não foi possível carregar as estatísticas.');
  }
};

export const enviarNovaInformacao = async (payload: NovaInformacaoPayload) => {
  const formData = new FormData();

  formData.append('ocorrenciaId', String(payload.ocoId));
  formData.append('descricaoLocal', payload.localizacao);
  formData.append('informacao', payload.observacoes);

  if (payload.fotos) {
    Array.from(payload.fotos).forEach((file) => {
      formData.append('arquivos', file);
    });
  }

  // O endpoint é o POST /v1/ocorrencias/informacoes-desaparecido
  const response = await api.post('/ocorrencias/informacoes-desaparecido', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
