import { useAppStore } from "./useAppStore";

export const useCropperStore = () => {
  const cropZoneWidth = useAppStore((state) => state.cropZoneWidth);
  const cropZoneHeight = useAppStore((state) => state.cropZoneHeight);
  const cropX = useAppStore((state) => state.cropX);
  const cropY = useAppStore((state) => state.cropY);
  const cropRatio = useAppStore((state) => state.cropRatio);
  const activeInputName = useAppStore((state) => state.activeInputName);

  const setCropZoneWidth = useAppStore((state) => state.setCropZoneWidth);
  const setCropZoneHeight = useAppStore((state) => state.setCropZoneHeight);
  const setCropX = useAppStore((state) => state.setCropX);
  const setCropY = useAppStore((state) => state.setCropY);
  const setCropRatio = useAppStore((state) => state.setCropRatio);
  const setActiveInputName = useAppStore((state) => state.setActiveInputName);
  const crop = useAppStore((state) => state.crop);

  return {
    cropZoneWidth,
    cropZoneHeight,
    cropX,
    cropY,
    cropRatio,
    activeInputName,
    setCropZoneWidth,
    setCropZoneHeight,
    setCropX,
    setCropY,
    setCropRatio,
    setActiveInputName,
    crop,
  };
};
