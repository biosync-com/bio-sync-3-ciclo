import React, { createContext, useContext, useMemo, useState } from 'react';

export const AccessibilityOptions = {
  NORMAL: 'Normal',
  PROTANOPIA: 'Protanopia',
  DEUTERANOPIA: 'Deuteranopia',
  TRITANOPIA: 'Tritanopia'
};

const AccessibilityThemeContext = createContext();

export function AccessibilityThemeProvider({ children }) {
  const [theme, setTheme] = useState(AccessibilityOptions.NORMAL);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);

  const value = useMemo(() => ({
    theme,
    fontSize,
    highContrast,
    applyColorBlindnessFilter: (themeName) => {
      if (Object.values(AccessibilityOptions).includes(themeName)) {
        setTheme(themeName);
      }
    },
    toggleHighContrast: () => setHighContrast(prev => !prev),
    setFontSize: (size) => setFontSize(Math.min(Math.max(size, 12), 24))
  }), [theme, fontSize, highContrast]);

  return (
    <AccessibilityThemeContext.Provider value={value}>
      {children}
    </AccessibilityThemeContext.Provider>
  );
}

export function useAccessibilityTheme() {
  const context = useContext(AccessibilityThemeContext);
  if (!context) {
    throw new Error('useAccessibilityTheme must be used within an AccessibilityThemeProvider');
  }
  return context;
}