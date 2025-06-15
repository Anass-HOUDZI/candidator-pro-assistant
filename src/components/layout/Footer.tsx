
import React from 'react';

interface FooterProps {
  authStyle?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ authStyle = false }) => {
  return (
    <footer
      className={
        authStyle
          ? "relative z-20 px-4 py-5 bg-transparent mt-10 rounded-xl border-0"
          : "bg-gradient-to-r from-primary-50 via-purple-50 to-blue-100 glass-effect shadow-medium border-t border-gray-200 py-5 px-4 mt-auto"
      }
      style={{
        ...(authStyle
          ? {}
          : {
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderTop: "1px solid rgba(49, 63, 111, 0.07)",
            }),
      }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <p
          className={
            authStyle
              ? "text-base md:text-lg font-bold tracking-wide text-blue-600 drop-shadow"
              : "text-sm text-gray-700 font-medium tracking-wide drop-shadow"
          }
        >
          Copyright © 2025{' '}
          <a
            href="https://www.linkedin.com/in/anasshoudzi/"
            target="_blank"
            rel="noopener noreferrer"
            className={
              authStyle
                ? "text-blue-600 underline underline-offset-2 hover:text-blue-800 font-bold transition-colors"
                : "text-blue-600 hover:text-blue-800 underline font-medium"
            }
          >
            Anass Houdzi
          </a>
          {' '}– Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};
