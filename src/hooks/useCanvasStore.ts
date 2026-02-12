import { useAppStore } from "./useAppStore";
import type { AppState } from "./useAppStore";

export const useCanvasStore = () => {
  const scale = useAppStore((state: AppState) => state.scale);
  const angle = useAppStore((state: AppState) => state.angle);
  const flipX = useAppStore((state: AppState) => state.flipX);
  const flipY = useAppStore((state: AppState) => state.flipY);
  const mode = useAppStore((state: AppState) => state.mode);
  const fabricCanvas = useAppStore((state: AppState) => state.fabricCanvas);

  const setFabricCanvas = useAppStore((state: AppState) => state.setFabricCanvas);
  const setScale = useAppStore((state: AppState) => state.setScale);
  const setAngle = useAppStore((state: AppState) => state.setAngle);
  const setFlipX = useAppStore((state: AppState) => state.setFlipX);
  const setFlipY = useAppStore((state: AppState) => state.setFlipY);
  const setMode = useAppStore((state: AppState) => state.setMode);

  return {
    scale,
    angle,
    flipX,
    flipY,
    mode,
    fabricCanvas,
    setFabricCanvas,
    setScale,
    setAngle,
    setFlipX,
    setFlipY,
    setMode,
  };
};
