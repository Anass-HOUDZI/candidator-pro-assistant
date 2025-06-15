
import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-4 px-4 mt-auto">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-sm text-gray-600">
          Copyright © 2025{' '}
          <a 
            href="https://www.linkedin.com/in/anasshoudzi/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Anass Houdzi
          </a>
          {' '}– Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};
