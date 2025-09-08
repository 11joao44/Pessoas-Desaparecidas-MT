import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { buscarPessoasPorId } from '../services/api';
import placeholderImageF from '../assets/placeholder-f.svg';
import placeholderImageM from '../assets/placeholder-m.svg';

const DetailItem: React.FC<{ label: string; value: string | number | null | undefined }> = ({
  label,
  value,
}) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm font-semibold text-gray-600">{label}</p>
      <p className="text-lg text-gray-800">{value}</p>
    </div>
  );
};

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['personDetails', id],
    queryFn: () => buscarPessoasPorId(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="text-center p-10">Carregando detalhes...</div>;
  }

  if (isError) {
    return <div className="text-center text-red-500 p-10">Erro: {error.message}</div>;
  }

  const person = data;
  const status = person?.ultimaOcorrencia?.dataLocalizacao ? 'Localizada' : 'Desaparecida';
  const statusColorClass = status === 'Desaparecida' ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          <Link to="/" className="text-blue-600 hover:underline mb-6 inline-block">
            &larr; Voltar para a lista
          </Link>

          <div className="md:flex gap-8">
            <div className="md:w-1/3 mb-6 md:mb-0">
              <img
                src={
                  (person?.urlFoto ?? person?.sexo === 'FEMININO')
                    ? placeholderImageF
                    : placeholderImageM
                }
                alt={person?.nome ?? 'Foto'}
                className="rounded-lg w-full shadow-md"
              />
            </div>
            <div className="md:w-2/3">
              <span
                className={`inline-block px-4 py-1 text-white rounded-full text-sm font-bold mb-4 ${statusColorClass}`}
              >
                {status}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{person?.nome}</h1>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <DetailItem label="Idade" value={person?.idade} />
                <DetailItem label="Sexo" value={person?.sexo} />
                <DetailItem
                  label="Data do Desaparecimento"
                  value={
                    person?.ultimaOcorrencia?.dtDesaparecimento
                      ? new Date(person.ultimaOcorrencia.dtDesaparecimento).toLocaleDateString()
                      : 'N/A'
                  }
                />
                <DetailItem
                  label="Local"
                  value={person?.ultimaOcorrencia?.localDesaparecimentoConcat}
                />
                <DetailItem
                  label="Vestimentas"
                  value={
                    person?.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO?.vestimentasDesaparecido
                  }
                />
                <DetailItem
                  label="Outras Informações"
                  value={person?.ultimaOcorrencia?.ocorrenciaEntrevDesapDTO?.informacao}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
