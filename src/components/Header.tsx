import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/icon.svg';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo e Título */}
          <Link to="/" className="flex items-center space-x-4">
            <img src={logo} alt="Logo Desenvolve MT" className="h-12" />
            <span className="text-xl sm:text-2xl font-bold text-gray-800">
              Pessoas Desaparecidas MT
            </span>
          </Link>
          <nav>
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-300"
            >
              Início
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
