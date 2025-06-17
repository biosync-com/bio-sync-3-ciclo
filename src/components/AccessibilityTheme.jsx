import React, { useState, useEffect, useRef } from 'react';
import { useAccessibilityTheme, AccessibilityOptions } from '../context/AccessibilityThemeContext';

const AccessibilityTheme = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { 
    theme: selectedOption, 
    applyColorBlindnessFilter,
    highContrast,
    toggleHighContrast
  } = useAccessibilityTheme();

  const options = [
    { 
      name: AccessibilityOptions.NORMAL, 
      description: 'Visão normal de cores' 
    },
    { 
      name: AccessibilityOptions.PROTANOPIA, 
      description: 'Daltonismo vermelho-verde (dificuldade com vermelhos)' 
    },
    { 
      name: AccessibilityOptions.DEUTERANOPIA, 
      description: 'Daltonismo verde-vermelho (dificuldade com verdes)' 
    },
    { 
      name: AccessibilityOptions.TRITANOPIA, 
      description: 'Daltonismo azul-amarelo' 
    },
  ];

  useEffect(() => {
    const handleInteractionOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleInteractionOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleInteractionOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="accessibility-toolbar">
      {/* Botão de Alto Contraste */}
      <button
        onClick={toggleHighContrast}
        className={`high-contrast-toggle ${highContrast ? 'active' : ''}`}
        aria-label={`Alto contraste ${highContrast ? 'ativado' : 'desativado'}`}
      >
        {highContrast ? '☀️' : '🌙'}
      </button>

      {/* Dropdown de Temas */}
      <div className="relative inline-block" ref={dropdownRef}>
        <button
          type="button"
          className="accessibility-toggle-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          <span aria-hidden="true">👁️</span>
          <span className="sr-only">Configurações de acessibilidade visual</span>
        </button>

        {isOpen && (
          <div className="accessibility-dropdown">
            {options.map((option) => (
              <button
                key={option.name}
                className={`dropdown-option ${selectedOption === option.name ? 'selected' : ''}`}
                onClick={() => {
                  applyColorBlindnessFilter(option.name);
                  setIsOpen(false);
                }}
                aria-current={selectedOption === option.name}
              >
                <div className="option-name">{option.name}</div>
                <div className="option-description">{option.description}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilityTheme;
export { AccessibilityOptions };