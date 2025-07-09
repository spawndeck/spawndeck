import { create } from 'zustand';
const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};
export const useTerminalStore = create((set, get) => ({
    tabs: [],
    activeTabId: null,
    createTab: (shell, cwd) => {
        const id = uuidv4();
        const newTab = {
            id,
            title: shell || 'Terminal',
            shell,
            cwd
        };
        set(state => ({
            tabs: [...state.tabs, newTab],
            activeTabId: id
        }));
    },
    closeTab: (id) => {
        set(state => {
            const filteredTabs = state.tabs.filter(tab => tab.id !== id);
            let newActiveId = state.activeTabId;
            // If closing the active tab, activate another one
            if (state.activeTabId === id) {
                const closedIndex = state.tabs.findIndex(tab => tab.id === id);
                if (filteredTabs.length > 0) {
                    // Try to activate the tab to the right, or the last one
                    newActiveId = filteredTabs[Math.min(closedIndex, filteredTabs.length - 1)].id;
                }
                else {
                    newActiveId = null;
                }
            }
            return {
                tabs: filteredTabs,
                activeTabId: newActiveId
            };
        });
    },
    setActiveTab: (id) => {
        console.log('Setting active tab to:', id);
        set({ activeTabId: id });
    },
    updateTabTitle: (id, title) => {
        set(state => ({
            tabs: state.tabs.map(tab => tab.id === id ? { ...tab, title } : tab)
        }));
    },
    reorderTabs: (tabs) => {
        set({ tabs });
    }
}));
