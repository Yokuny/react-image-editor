import type { AppState } from "./useAppStore";
import { useAppStore } from "./useAppStore";

export const useObjectManagerStore = () => {
  const selectedObject = useAppStore((state: AppState) => state.selectedObject);
  const notification = useAppStore((state: AppState) => state.notification);

  const setSelectedObject = useAppStore((state: AppState) => state.setSelectedObject);
  const setNotification = useAppStore((state: AppState) => state.setNotification);

  return {
    selectedObject,
    notification,
    setSelectedObject,
    setNotification,
  };
};
