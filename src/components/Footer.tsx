import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="mb-2">
            Desenvolvido por <strong>[Seu Nome Completo]</strong> para o processo seletivo da
            Desenvolve MT.
          </p>
          <p className="text-sm text-gray-400 mb-2">
            Dados fornecidos pela Polícia Judiciária Civil de Mato Grosso.
          </p>
          <a
            href="https://github.com/seu-usuario/seu-repositorio" // ATUALIZE ESTE LINK
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300 underline"
          >
            Ver código-fonte no GitHub
          </a>
          <p className="text-sm text-gray-500 mt-4">
            &copy; {currentYear} Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
