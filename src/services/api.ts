import axios from 'axios';

export interface Root {
  id: number;
  nome: string;
  idade: number;
  sexo: string;
  vivo: boolean;
  urlFoto: string;
  ultimaOcorrencia: UltimaOcorrencia;
}

export interface UltimaOcorrencia {
  dtDesaparecimento: string;
  dataLocalizacao: string;
  encontradoVivo: boolean;
  localDesaparecimentoConcat: string;
  ocorrenciaEntrevDesapDTO: any;
  listaCartaz: any[];
  ocoId: number;
}

export const api = axios.create({
  baseURL: 'https://abitus-api.geia.vip',
});

export const getMissingPersons = async (page = 1, searchTerm = ''): Promise<PaginatedResponse> => {
  const allMockData: Person[] = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    nome: `Pessoa Fictícia ${i + 1}`,
    foto: `https://via.placeholder.com/400x300?text=Pessoa+${i + 1}`,
    status: (i + 1) % 3 === 0 ? 'Localizada' : 'Desaparecida',
  })).filter((p) => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalPages = Math.ceil(allMockData.length / 10);
  const content = allMockData.slice((page - 1) * 10, page * 10);

  await new Promise((resolve) => setTimeout(resolve, 500)); // Simula delay
  return { content, totalPages, totalElements: allMockData.length };
};
