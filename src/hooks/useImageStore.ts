import type { AppState } from "./useAppStore";
import { useAppStore } from "./useAppStore";

export const useImageStore = () => {
  const imageUrl = useAppStore((state: AppState) => state.imageUrl);
  const imageInstance = useAppStore((state: AppState) => state.imageInstance);
  const imageWidth = useAppStore((state: AppState) => state.imageWidth);
  const imageHeight = useAppStore((state: AppState) => state.imageHeight);

  const setImageUrl = useAppStore((state: AppState) => state.setImageUrl);
  const setImageInstance = useAppStore((state: AppState) => state.setImageInstance);
  const setImageSize = useAppStore((state: AppState) => state.setImageSize);
  const resetImage = useAppStore((state: AppState) => state.resetImage);

  return {
    imageUrl,
    imageInstance,
    imageWidth,
    imageHeight,
    setImageUrl,
    setImageInstance,
    setImageSize,
    resetImage,
  };
};
