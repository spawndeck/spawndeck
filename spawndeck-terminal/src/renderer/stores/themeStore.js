import { create } from 'zustand';
const defaultTheme = {
    name: 'VS Code Dark',
    colors: {
        background: '#1e1e1e',
        foreground: '#d4d4d4',
        cursor: '#d4d4d4',
        selection: 'rgba(255, 255, 255, 0.3)',
        black: '#000000',
        brightBlack: '#666666',
        red: '#cd3131',
        brightRed: '#f14c4c',
        green: '#0dbc79',
        brightGreen: '#23d18b',
        yellow: '#e5e510',
        brightYellow: '#f5f543',
        blue: '#2472c8',
        brightBlue: '#3b8eea',
        magenta: '#bc3fbc',
        brightMagenta: '#d670d6',
        cyan: '#11a8cd',
        brightCyan: '#29b8db',
        white: '#e5e5e5',
        brightWhite: '#ffffff'
    }
};
export const useThemeStore = create((set) => ({
    themes: [defaultTheme],
    currentTheme: 'VS Code Dark',
    setTheme: (themeName) => set({ currentTheme: themeName })
}));
