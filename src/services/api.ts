import axios from 'axios';

interface ApiPersonSummary {
  id: number;
  nome: string;
  idade: number;
  sexo: string;
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

export const api = axios.create({
  baseURL: 'https://abitus-api.geia.vip/v1',
});

export const buscarPessoasPorFiltro = async (
  page = 1,
  searchTerm = '',
): Promise<PaginatedResponse> => {
  const response = await api.get<PaginatedApiResponse>('/pessoas/aberto/filtro', {
    params: {
      page: page - 1,
      size: 12, // Aumentado para 12 para preencher melhor a grade
      nome: searchTerm || undefined,
    },
  });
  const apiData = response.data;

  const transformedContent: Person[] = apiData.content.map((p) => ({
    id: p.id,
    nome: p.nome,
    foto: p.urlFoto || 'https://via.placeholder.com/400x300?text=Sem+Foto',
    status: p.ultimaOcorrencia?.dataLocalizacao ? 'Localizada' : 'Desaparecida',
    sexo: p.sexo === 'MASCULINO' ? 'MASCULINO' : 'FEMININO',
  }));

  return {
    content: transformedContent,
    totalPages: apiData.totalPages,
    totalElements: apiData.totalElements,
  };
};

export const buscarPessoasPorId = async (id: string): Promise<PersonDetails> => {
  const response = await api.get<PersonDetails>(`/pessoas/${id}`);
  return response.data;
};

export const buscarPorEstatisticas = async (): Promise<Statistics> => {
  const response = await api.get<Statistics>('/pessoas/aberto/estatistico');
  return response.data;
};
