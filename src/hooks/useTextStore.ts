import type { AppState } from "./useAppStore";
import { useAppStore } from "./useAppStore";

export const useTextStore = () => {
  const fontWeight = useAppStore((state: AppState) => state.fontWeight);
  const underline = useAppStore((state: AppState) => state.underline);
  const fontStyle = useAppStore((state: AppState) => state.fontStyle);
  const textAlign = useAppStore((state: AppState) => state.textAlign);
  const fontSize = useAppStore((state: AppState) => state.fontSize);
  const lineHeight = useAppStore((state: AppState) => state.lineHeight);
  const fontColorCode = useAppStore((state: AppState) => state.fontColorCode);
  const isBgTransparent = useAppStore((state: AppState) => state.isBgTransparent);
  const bgColorCode = useAppStore((state: AppState) => state.bgColorCode);

  const setFontWeight = useAppStore((state: AppState) => state.setFontWeight);
  const setUnderline = useAppStore((state: AppState) => state.setUnderline);
  const setFontStyle = useAppStore((state: AppState) => state.setFontStyle);
  const setTextAlign = useAppStore((state: AppState) => state.setTextAlign);
  const setFontSize = useAppStore((state: AppState) => state.setFontSize);
  const setLineHeight = useAppStore((state: AppState) => state.setLineHeight);
  const setFontColorCode = useAppStore((state: AppState) => state.setFontColorCode);
  const setIsBgTransparent = useAppStore((state: AppState) => state.setIsBgTransparent);
  const setBgColorCode = useAppStore((state: AppState) => state.setBgColorCode);
  const addText = useAppStore((state: AppState) => state.addText);
  const deleteSelectedObject = useAppStore((state: AppState) => state.deleteSelectedObject);

  return {
    fontWeight,
    underline,
    fontStyle,
    textAlign,
    fontSize,
    lineHeight,
    fontColorCode,
    isBgTransparent,
    bgColorCode,
    setFontWeight,
    setUnderline,
    setFontStyle,
    setTextAlign,
    setFontSize,
    setLineHeight,
    setFontColorCode,
    setIsBgTransparent,
    setBgColorCode,
    addText,
    deleteSelectedObject,
  };
};
