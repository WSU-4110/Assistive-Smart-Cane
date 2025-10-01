import { useState } from 'react';

interface ColorTheme {
  id: string;
  bgColor: string;
}

const colorThemes: ColorTheme[] = [
  { id: 'black-white', bgColor: '#f3f4f6' },
  { id: 'blue-yellow', bgColor: '#1e293b' },
  { id: 'purple-yellow', bgColor: '#603F9D' },
];

export function ColorTheme() {
  const [selectedTheme, setSelectedTheme] = useState('black-white');

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    // Apply theme to document root
    document.documentElement.setAttribute('data-theme', themeId);
  };

  return (
    <div className="p-4 bg-card border-4 border-border rounded-xl">
      <div className="flex items-center justify-center gap-4">
        {colorThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeChange(theme.id)}
            className={`relative p-1 rounded-full transition-all ${
              selectedTheme === theme.id
                ? 'ring-4 ring-primary'
                : 'hover:ring-2 hover:ring-muted-foreground'
            }`}
          >
            <div 
              className="w-8 h-8 rounded-full border-2 border-border"
              style={{ backgroundColor: theme.bgColor }}
            ></div>
          </button>
        ))}
      </div>
      
      <p className="text-xl text-muted-foreground mt-3 text-center">
        Choose a color theme
      </p>
    </div>
  );
}