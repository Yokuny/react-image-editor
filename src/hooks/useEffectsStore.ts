import { useAppStore } from "./useAppStore";
import type { AppState } from "./useAppStore";

export const useEffectsStore = () => {
  const brightness = useAppStore((state: AppState) => state.brightness);
  const contrast = useAppStore((state: AppState) => state.contrast);
  const saturation = useAppStore((state: AppState) => state.saturation);
  const tintColor = useAppStore((state: AppState) => state.tintColor);
  const tintOpacity = useAppStore((state: AppState) => state.tintOpacity);
  const invert = useAppStore((state: AppState) => state.invert);
  const hue = useAppStore((state: AppState) => state.hue);
  const noise = useAppStore((state: AppState) => state.noise);
  const blur = useAppStore((state: AppState) => state.blur);
  const pixelate = useAppStore((state: AppState) => state.pixelate);

  const setBrightness = useAppStore((state: AppState) => state.setBrightness);
  const setContrast = useAppStore((state: AppState) => state.setContrast);
  const setSaturation = useAppStore((state: AppState) => state.setSaturation);
  const setTintColor = useAppStore((state: AppState) => state.setTintColor);
  const setTintOpacity = useAppStore((state: AppState) => state.setTintOpacity);
  const setInvert = useAppStore((state: AppState) => state.setInvert);
  const setHue = useAppStore((state: AppState) => state.setHue);
  const setNoise = useAppStore((state: AppState) => state.setNoise);
  const setBlur = useAppStore((state: AppState) => state.setBlur);
  const setPixelate = useAppStore((state: AppState) => state.setPixelate);
  const resetEffects = useAppStore((state: AppState) => state.resetEffects);

  return {
    brightness,
    contrast,
    saturation,
    tintColor,
    tintOpacity,
    invert,
    hue,
    noise,
    blur,
    pixelate,
    setBrightness,
    setContrast,
    setSaturation,
    setTintColor,
    setTintOpacity,
    setInvert,
    setHue,
    setNoise,
    setBlur,
    setPixelate,
    resetEffects,
  };
};
