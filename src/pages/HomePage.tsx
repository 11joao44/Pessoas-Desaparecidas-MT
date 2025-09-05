/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import placeholderImage from '../assets/placeholder-image.jpg';

interface PersonCardProps {
  id: number;
  nome: string;
  foto: string;
}

const PersonCard: React.FC<PersonCardProps> = ({ id, nome, foto }) => {
  return (
    <Link to={`/details/${id}`} className="block">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-72">
          <img src={foto} alt={nome} className="w-full h-full object-cover" />
          <span
            className={`absolute top-2 right-2 px-3 py-1 text-sm font-semibold text-white rounded-full`}
          ></span>
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate">{nome}</h3>
        </div>
      </div>
    </Link>
  );
};

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [people, setPeople] = useState<PersonCardProps[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fetchPeople = async (page: number, term: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));

      const mockData: PersonCardProps[] = [
        {
          id: 1,
          nome: 'Maria Silva',
          foto: placeholderImage,
        },
        {
          id: 2,
          nome: 'João Santos',
          foto: placeholderImage,
        },
        {
          id: 3,
          nome: 'Ana Costa',
          foto: placeholderImage,
        },
        {
          id: 4,
          nome: 'Pedro Almeida',
          foto: placeholderImage,
        },
        {
          id: 5,
          nome: 'Laura Fernandes',
          foto: placeholderImage,
        },
        {
          id: 6,
          nome: 'Carlos Oliveira',
          foto: placeholderImage,
        },
        {
          id: 7,
          nome: 'Fernanda Lima',
          foto: placeholderImage,
        },
        {
          id: 8,
          nome: 'Lucas Rocha',
          foto: placeholderImage,
        },
        {
          id: 9,
          nome: 'Isabela Pereira',
          foto: placeholderImage,
        },
        {
          id: 10,
          nome: 'Gustavo Ribeiro',
          foto: placeholderImage,
        },
        {
          id: 11,
          nome: 'Mariana Pires',
          foto: placeholderImage,
        },
      ].filter((person) => person.nome.toLowerCase().includes(term.toLowerCase()));

      const pageSize = 10;
      const paginatedData = mockData.slice((page - 1) * pageSize, page * pageSize);

      setPeople(paginatedData);
      setTotalPages(Math.ceil(mockData.length / pageSize));
    } catch (err) {
      setError('Não foi possível carregar os dados. Tente novamente mais tarde.');
      console.error('Erro ao buscar pessoas:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeople(currentPage, searchTerm);
  }, [currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPeople(1, searchTerm);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Pessoas Desaparecidas</h1>
        <p className="text-lg text-gray-600">
          Encontre e ajude a divulgar informações sobre pessoas.
        </p>
      </header>

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
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
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

      {error && (
        <div
          className="max-w-4xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-8"
          role="alert"
        >
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {loading && !error && people.length === 0 ? (
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
        <div className="text-center text-gray-600 text-xl py-10">Nenhum resultado encontrado.</div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-4 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Anterior
          </button>
          <span className="text-lg font-medium text-gray-700">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="px-5 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
          >
            Próxima
          </button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
