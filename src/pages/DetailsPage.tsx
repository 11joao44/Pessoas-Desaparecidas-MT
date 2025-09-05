// src/pages/DetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface PersonDetails {
  id: string;
  nome: string;
  foto: string;
  status: 'Desaparecida' | 'Localizada';
  idade: number;
  genero: string;
  dataDesaparecimento: string;
  cidade: string;
  estado: string;
  caracteristicas: string;
  contatoInformacao: string;
}

const DetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [person, setPerson] = useState<PersonDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPersonDetails = async () => {
      if (!id) {
        setError('ID da pessoa não fornecido.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockDetails: PersonDetails = {
          id: id,
          nome: `Pessoa ${id}`,
          foto: `https://via.placeholder.com/600x400?text=Pessoa+${id}`,
          status:
            id === '2' || id === '5' || id === '8' || id === '10' ? 'Localizada' : 'Desaparecida',
          idade: 30,
          genero: 'Feminino',
          dataDesaparecimento: '15/03/2023',
          cidade: 'Cuiabá',
          estado: 'MT',
          caracteristicas:
            'Altura: 1.65m, Cabelos castanhos, Olhos verdes, tatuagem no braço direito.',
          contatoInformacao: '(65) 99999-9999 ou email@email.com',
        };

        setPerson(mockDetails);

        // **SUBSTITUA ESTA LÓGICA PELA SUA CHAMADA REAL À API**
        // Ex: const response = await getPersonDetails(id);
        // setPerson(response.data);
      } catch (err) {
        setError('Não foi possível carregar os detalhes da pessoa.');
        console.error('Erro ao buscar detalhes:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonDetails();
  }, [id]); // Refetch quando o ID na URL muda

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md"
          role="alert"
        >
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline"> {error}</span>
          <Link to="/" className="block mt-2 text-red-700 hover:text-red-900 underline">
            Voltar para a lista
          </Link>
        </div>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md"
          role="alert"
        >
          <strong className="font-bold">Ops:</strong>
          <span className="block sm:inline"> Pessoa não encontrada.</span>
          <Link to="/" className="block mt-2 text-yellow-700 hover:text-yellow-900 underline">
            Voltar para a lista
          </Link>
        </div>
      </div>
    );
  }

  const statusColorClass = person.status === 'Desaparecida' ? 'bg-red-600' : 'bg-green-600';
  const statusRingClass = person.status === 'Desaparecida' ? 'ring-red-300' : 'ring-green-300';

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
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

          <div className="flex flex-col md:flex-row gap-8">
            {/* Coluna da Imagem */}
            <div className="md:w-1/2 flex justify-center items-start">
              <div className="w-full max-w-sm bg-gray-200 rounded-lg overflow-hidden shadow-lg border border-gray-200">
                <img src={person.foto} alt={person.nome} className="w-full h-auto object-cover" />
              </div>
            </div>

            {/* Coluna de Detalhes */}
            <div className="md:w-1/2">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{person.nome}</h1>

              {/* Status Destaque */}
              <div
                className={`inline-block px-5 py-2 text-lg font-bold text-white rounded-full shadow-md ${statusColorClass} ring-4 ${statusRingClass} mb-6`}
              >
                {person.status}
              </div>

              <div className="space-y-4 text-gray-700 text-lg">
                <p>
                  <strong className="font-semibold text-gray-800">Idade:</strong> {person.idade}{' '}
                  anos
                </p>
                <p>
                  <strong className="font-semibold text-gray-800">Gênero:</strong> {person.genero}
                </p>
                <p>
                  <strong className="font-semibold text-gray-800">Data do Desaparecimento:</strong>{' '}
                  {person.dataDesaparecimento}
                </p>
                <p>
                  <strong className="font-semibold text-gray-800">Local do Desaparecimento:</strong>{' '}
                  {person.cidade}, {person.estado}
                </p>
                <p>
                  <strong className="font-semibold text-gray-800">
                    Características Marcantes:
                  </strong>{' '}
                  {person.caracteristicas}
                </p>
                <p>
                  <strong className="font-semibold text-gray-800">Contato para Informações:</strong>{' '}
                  {person.contatoInformacao}
                </p>
                {/* Adicione mais detalhes aqui conforme sua API */}
              </div>

              {/* Botão para Enviar Informações */}
              <div className="mt-8">
                <Link
                  to="/submit-info" // Você precisará criar esta rota e componente
                  className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 transform hover:scale-105"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7 mr-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h5v3a1 1 0 102 0v-3h5a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 5a3 3 0 013 3v2.586l.707.707A1 1 0 0015 12h-3v-3a1 1 0 00-2 0v3H5a1 1 0 00.707-1.707L7 10.586V8a3 3 0 013-3z" />
                  </svg>
                  Enviar Informações
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;
