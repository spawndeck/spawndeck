export interface ElectronAPI {
  pty: {
    create: (options?: {
      cols?: number;
      rows?: number;
      cwd?: string;
      env?: Record<string, string>;
      shell?: string;
      shellArgs?: string[];
    }) => Promise<{ id: string; pid: number; title: string }>;
    write: (id: string, data: string) => Promise<void>;
    resize: (id: string, cols: number, rows: number) => Promise<void>;
    kill: (id: string, signal?: string) => Promise<void>;
    onData: (callback: (data: { id: string; data: string }) => void) => void;
    onExit: (callback: (data: { id: string; exitCode: number; signal?: string }) => void) => void;
  };
  window: {
    create: () => Promise<number>;
    close: (id: number) => Promise<void>;
    minimize: () => Promise<void>;
    maximize: () => Promise<void>;
    closeCurrent: () => Promise<void>;
  };
  app: {
    getInfo: () => Promise<{
      name: string;
      version: string;
      platform: NodeJS.Platform;
      arch: string;
      node: string;
      electron: string;
    }>;
  };
  platform: NodeJS.Platform;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}