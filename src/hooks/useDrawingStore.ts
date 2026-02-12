import { useAppStore } from "./useAppStore";
import type { AppState } from "./useAppStore";

export const useDrawingStore = () => {
  const opacity = useAppStore((state: AppState) => state.opacity);
  const colorCode = useAppStore((state: AppState) => state.colorCode);
  const lineWidth = useAppStore((state: AppState) => state.lineWidth);
  const isLineStraight = useAppStore((state: AppState) => state.isLineStraight);

  const setOpacity = useAppStore((state: AppState) => state.setOpacity);
  const setColorCode = useAppStore((state: AppState) => state.setColorCode);
  const setLineWidth = useAppStore((state: AppState) => state.setLineWidth);
  const setIsLineStraight = useAppStore((state: AppState) => state.setIsLineStraight);

  const color = `rgba(${colorCode}, ${opacity})`;

  return {
    opacity,
    colorCode,
    lineWidth,
    isLineStraight,
    color,
    setOpacity,
    setColorCode,
    setLineWidth,
    setIsLineStraight,
  };
};
