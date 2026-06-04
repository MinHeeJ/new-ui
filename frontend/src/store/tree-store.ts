import { create } from 'zustand';
import { folderApi } from '../api';

type TreeState = {
  selectedFolderCode: string | null;
  expandedCodes: string[];
  folderMap: Record<string, any[]>;
  setSelected: (code: string | null) => void;
  toggleExpand: (code: string) => void;
  loadChildren: (code: string, portalMode?: boolean) => Promise<any>;
};

export const useTreeStore = create<TreeState>((set, get) => ({
  selectedFolderCode: null,
  expandedCodes: [],
  folderMap: {},
  setSelected: (code) => set({ selectedFolderCode: code }),
  toggleExpand: (code) => set((s) => ({ expandedCodes: s.expandedCodes.includes(code) ? s.expandedCodes.filter((c) => c !== code) : [...s.expandedCodes, code] })),
  loadChildren: async (code, portalMode = false) => {
    const result = await folderApi.getChildren(code, portalMode);
    set({ folderMap: { ...get().folderMap, [code]: result.folders || [] } });
    return result;
  },
}));
