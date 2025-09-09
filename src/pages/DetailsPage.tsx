import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { buscarPessoaPorId, enviarNovaInformacao } from '../services/api';
import type { NovaInformacaoPayload } from '../services/api';
import placeholderImageF from '../assets/placeholder-f.svg';
import placeholderImageM from '../assets/placeholder-m.svg';

const DetailItem: React.FC<{ label: string; value: string | number | null | undefined }> = ({
  label,
  value,
}) => {
  if (!value) return null;
  return (
    <div className="py-4">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</p>
      <p className="text-lg text-gray-800 whitespace-pre-wrap">{value}</p>
    </div>
  );
};

const InfoModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  personName: string;
  ocoId: number | undefined;
}> = ({ isOpen, onClose, personName, ocoId }) => {
  const [localizacao, setLocalizacao] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [fotos, setFotos] = useState<FileList | null>(null);
  const mutation = useMutation({
    mutationFn: enviarNovaInformacao,
    onSuccess: () => {
      setTimeout(() => handleClose(), 3000);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ocoId) return;

    const payload: NovaInformacaoPayload = { ocoId, localizacao, observacoes, fotos };
    mutation.mutate(payload);
  };

  const handleClose = () => {
    setLocalizacao('');
    setObservacoes('');
    setFotos(null);
    mutation.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Registrar Informação</h2>
          <p className="text-gray-600">Você tem informações sobre {personName}?</p>
        </div>

        {mutation.isSuccess ? (
          <div className="p-8 text-center">
            <h3 className="text-xl font-semibold text-green-600">
              Informação Enviada com Sucesso!
            </h3>
            <p className="text-gray-600 mt-2">
              Obrigado pela sua colaboração. As autoridades foram notificadas.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
              <div>
                <label
                  htmlFor="localizacao"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Local onde a pessoa foi vista
                </label>
                <input
                  type="text"
                  id="localizacao"
                  required
                  value={localizacao}
                  onChange={(e) => setLocalizacao(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="observacoes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Observações Adicionais
                </label>
                <textarea
                  id="observacoes"
                  rows={4}
                  required
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div>
                <label htmlFor="fotos" className="block text-sm font-medium text-gray-700 mb-1">
                  Anexar Fotos (opcional)
                </label>
                <input
                  type="file"
                  id="fotos"
                  multiple
                  onChange={(e) => setFotos(e.target.files)}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
              {mutation.isError && (
                <p className="text-sm text-red-600">
                  Falha no envio. Por favor, verifique os dados e tente novamente.
                </p>
              )}
            </div>
            <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={mutation.isPending}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? 'Enviando...' : 'Enviar Informação'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['personDetails', id],
    queryFn: () => buscarPessoaPorId(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[calc(100vh-200px)] p-8 flex justify-center items-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md text-center"
          role="alert"
        >
          <strong className="font-bold block">Ocorreu um Erro</strong>
          <span className="block sm:inline">
            {error instanceof Error ? error.message : 'Não foi possível carregar os dados.'}
          </span>
          <Link
            to="/"
            className="block mt-4 text-red-700 hover:text-red-900 underline font-semibold"
          >
            Voltar para a lista
          </Link>
        </div>
      </div>
    );
  }

  const person = data;
  const status = person?.ultimaOcorrencia?.dataLocalizacao ? 'Localizada' : 'Desaparecida';
  const statusColorClass = status === 'Desaparecida' ? 'bg-red-500' : 'bg-green-500';
  const placeholderImage = person?.sexo === 'FEMININO' ? placeholderImageF : placeholderImageM;

  return (
    <>
      <InfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        personName={person?.nome ?? ''}
        ocoId={undefined}
      />
      <div className="bg-gray-100 p-4 sm:p-6 lg:p-8 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6">
            <Link to="/" className="text-blue-600 hover:underline mb-6 inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Voltar para a lista
            </Link>
            <div className="md:flex gap-8">
              <div className="md:w-1/3 mb-6 md:mb-0">
                <img
                  src={person?.urlFoto ?? placeholderImage}
                  alt={person?.nome ?? 'Foto'}
                  className="rounded-lg w-full shadow-md aspect-square object-cover"
                />
              </div>
              <div className="md:w-2/3">
                <span
                  className={`inline-block px-4 py-1 text-white rounded-full text-sm font-bold mb-4 ${statusColorClass}`}
                >
                  {status}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{person?.nome}</h1>
                <div className="border-t divide-y divide-gray-200">
                  <DetailItem label="Idade" value={person?.idade} />
                  <DetailItem label="Sexo" value={person?.sexo} />
                  <DetailItem
                    label="Data do Desaparecimento"
                    value={
                      person?.ultimaOcorrencia?.dtDesaparecimento
                        ? new Date(person.ultimaOcorrencia.dtDesaparecimento).toLocaleDateString(
                            'pt-BR',
                          )
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
                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-lg font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors transform hover:scale-105"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Registrar Nova Informação
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailsPage;
