import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { Person } from '../services/api';
import { buscarPessoasPorFiltro, buscarPorEstatisticas } from '../services/api';
import placeholderImageF from '../assets/placeholder-f.svg';
import placeholderImageM from '../assets/placeholder-m.svg';
import { useDebounce } from '../hooks/useDebounce';

const StatCard: React.FC<{ label: string; value: number | undefined; className: string }> = ({
  label,
  value,
  className,
}) => (
  <div className={`p-4 rounded-lg shadow-lg text-white ${className}`}>
    <p className="text-lg">{label}</p>
    <p className="text-4xl font-bold">{value ?? '...'}</p>
  </div>
);

const PersonCard: React.FC<Person> = ({ id, nome, foto, status, sexo }) => {
  const statusColorClass = status === 'Desaparecida' ? 'bg-red-500' : 'bg-green-500';
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = sexo === 'FEMININO' ? placeholderImageF : placeholderImageM;
  };

  return (
    <Link to={`/details/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative h-48 sm:h-56">
          <img
            src={foto}
            alt={nome}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          <span
            className={`absolute top-2 right-2 px-3 py-1 text-sm font-semibold text-white rounded-full ${statusColorClass}`}
          >
            {status}
          </span>
        </div>
        <div className="p-4">
          <h3 className="text-xl font-semibold text-gray-800 truncate">{nome}</h3>
        </div>
      </div>
    </Link>
  );
};

const HomePage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const queryClient = useQueryClient();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: statsData } = useQuery({
    queryKey: ['statistics'],
    queryFn: buscarPorEstatisticas,
    staleTime: 1000 * 60 * 10, // Cache de 10 minutos
  });

  const {
    isLoading,
    isError,
    error,
    data: peopleData,
    isFetching,
    isPlaceholderData,
  } = useQuery({
    queryKey: ['missingPersons', currentPage, debouncedSearchTerm],
    queryFn: () => buscarPessoasPorFiltro(currentPage, debouncedSearchTerm),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
  });

  useEffect(() => {
    if (!isPlaceholderData && peopleData?.totalPages && currentPage < peopleData.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['missingPersons', currentPage + 1, debouncedSearchTerm],
        queryFn: () => buscarPessoasPorFiltro(currentPage + 1, debouncedSearchTerm),
      });
    }
  }, [peopleData, currentPage, debouncedSearchTerm, isPlaceholderData, queryClient]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const people = peopleData?.content ?? [];
  const totalPages = peopleData?.totalPages ?? 0;

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Pessoas Desaparecidas</h1>
        <p className="text-lg text-gray-600">
          Encontre e ajude a divulgar informações sobre pessoas.
        </p>
      </header>

      <div className="max-w-4xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          label="Pessoas Desaparecidas"
          value={statsData?.quantPessoasDesaparecidas}
          className="bg-red-500"
        />
        <StatCard
          label="Pessoas Localizadas"
          value={statsData?.quantPessoasEncontradas}
          className="bg-green-500"
        />
      </div>

      <form
        onSubmit={handleSearch}
        className="max-w-xl mx-auto mb-8 bg-white p-6 rounded-lg shadow-md"
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="flex-grow p-3 border text-gray-800 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
          >
            {isFetching ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              'Buscar'
            )}
          </button>
        </div>
      </form>

      {isError && (
        <div
          className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8"
          role="alert"
        >
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline">
            {' '}
            {error instanceof Error ? error.message : 'Não foi possível carregar os dados.'}
          </span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : people.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {people.map((person) => (
            <PersonCard key={person.id} {...person} />
          ))}
        </div>
      ) : (
        !isFetching && (
          <div className="text-center text-gray-600 text-xl py-10">
            Nenhum resultado encontrado.
          </div>
        )
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-10">
          <button
            onClick={() => setCurrentPage((old) => Math.max(old - 1, 1))}
            disabled={currentPage === 1}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-lg font-medium text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => {
              if (!isPlaceholderData && currentPage < totalPages) {
                setCurrentPage((old) => old + 1);
              }
            }}
            disabled={isPlaceholderData || currentPage >= totalPages}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
