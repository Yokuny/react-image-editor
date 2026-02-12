import type { AppState } from "./useAppStore";
import { useAppStore } from "./useAppStore";

export const useUIStore = () => {
  const isToolbarOpen = useAppStore((state: AppState) => state.isToolbarOpen);
  const canUndo = useAppStore((state: AppState) => state.canUndo);
  const canRedo = useAppStore((state: AppState) => state.canRedo);
  const toggleToolbar = useAppStore((state: AppState) => state.toggleToolbar);
  const closeToolbar = useAppStore((state: AppState) => state.closeToolbar);
  const updateHistoryButtons = useAppStore((state: AppState) => state.updateHistoryButtons);

  return {
    isToolbarOpen,
    canUndo,
    canRedo,
    toggleToolbar,
    closeToolbar,
    updateHistoryButtons,
  };
};
