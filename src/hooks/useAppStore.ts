import { create } from "zustand";
import * as fabric from "fabric";
import { History } from "../command/commandHistory";

export type ModeName = "crop" | "adjust" | "drawing" | "text" | "effects" | "";

export interface AppState {
  // Global Singleton
  history: History;

  // Canvas State
  scale: number;
  angle: number;
  flipX: boolean;
  flipY: boolean;
  mode: ModeName;
  fabricCanvas: fabric.Canvas | null;

  // UI State
  isToolbarOpen: boolean;
  canUndo: boolean;
  canRedo: boolean;

  // Drawing State
  opacity: number;
  colorCode: string;
  lineWidth: number;
  isLineStraight: boolean;

  // Image State
  imageUrl: string;
  imageInstance: fabric.Image | null;
  imageWidth: number;
  imageHeight: number;

  // Object Manager State
  selectedObject: fabric.Object | null;
  notification: { type: string; data: unknown };

  // Text State
  fontWeight: string | number;
  underline: boolean;
  fontStyle: "normal" | "italic" | "oblique" | "";
  textAlign: "left" | "center" | "right" | "justify" | "justify-left" | "justify-center" | "justify-right";
  fontSize: number;
  lineHeight: number;
  fontColorCode: string;
  isBgTransparent: boolean;
  bgColorCode: string;

  // Actions
  setFontWeight: (fontWeight: string | number) => void;
  setUnderline: (underline: boolean) => void;
  setFontStyle: (fontStyle: "normal" | "italic" | "oblique" | "") => void;
  setTextAlign: (textAlign: "left" | "center" | "right" | "justify" | "justify-left" | "justify-center" | "justify-right") => void;
  setFontSize: (fontSize: number) => void;
  setLineHeight: (lineHeight: number) => void;
  setFontColorCode: (fontColorCode: string) => void;
  setIsBgTransparent: (isBgTransparent: boolean) => void;
  setBgColorCode: (bgColorCode: string) => void;
  addText: () => void;
  deleteSelectedObject: () => void;
  setFabricCanvas: (canvas: fabric.Canvas) => void;
  setScale: (scale: number) => void;
  setAngle: (angle: number) => void;
  setFlipX: (flipX: boolean) => void;
  setFlipY: (flipY: boolean) => void;
  setMode: (mode: ModeName) => void;
  toggleToolbar: (mode: ModeName) => void;
  closeToolbar: () => void;
  updateHistoryButtons: (canUndo: boolean, canRedo: boolean) => void;

  setOpacity: (opacity: number) => void;
  setColorCode: (colorCode: string) => void;
  setLineWidth: (lineWidth: number) => void;
  setIsLineStraight: (isLineStraight: boolean) => void;

  setImageUrl: (url: string) => void;
  setImageInstance: (instance: fabric.Image | null) => void;
  setImageSize: (width: number, height: number) => void;

  // Effects State
  brightness: number;
  contrast: number;
  saturation: number;
  tintColor: string;
  tintOpacity: number;
  invert: number;
  hue: number;
  noise: number;
  blur: number;
  pixelate: number;

  // Actions
  setBrightness: (brightness: number) => void;
  setContrast: (contrast: number) => void;
  setSaturation: (saturation: number) => void;
  setTintColor: (tintColor: string) => void;
  setTintOpacity: (tintOpacity: number) => void;
  setInvert: (invert: number) => void;
  setHue: (hue: number) => void;
  setNoise: (noise: number) => void;
  setBlur: (blur: number) => void;
  setPixelate: (pixelate: number) => void;
  resetEffects: () => void;

  // Cropper State
  cropZoneWidth: number;
  cropZoneHeight: number;
  cropRatio: { width: number; height: number } | null;
  activeInputName: string;

  setCropZoneWidth: (width: number) => void;
  setCropZoneHeight: (height: number) => void;
  setCropRatio: (ratio: { width: number; height: number } | null) => void;
  setActiveInputName: (name: string) => void;
  crop: () => void;
  resetImage: () => void;

  setSelectedObject: (obj: fabric.Object | null) => void;
  setNotification: (notification: { type: string; data: unknown }) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial State
  history: new History(),
  scale: 1,
  angle: 0,
  flipX: false,
  flipY: false,
  mode: "",
  fabricCanvas: null,
  isToolbarOpen: false,
  canUndo: false,
  canRedo: false,
  opacity: 1,
  colorCode: "61,61,61",
  lineWidth: 1,
  isLineStraight: false,
  imageUrl: "",
  imageInstance: null,
  imageWidth: 0,
  imageHeight: 0,
  selectedObject: null,
  notification: { type: "", data: null },
  fontWeight: "normal",
  underline: false,
  fontStyle: "normal",
  textAlign: "left",
  fontSize: 40,
  lineHeight: 1,
  fontColorCode: "61, 61, 61",
  isBgTransparent: true,
  bgColorCode: "255, 255, 255",
  brightness: 0,
  contrast: 0,
  saturation: 0,
  tintColor: "#000",
  tintOpacity: 0,
  invert: 0,
  hue: 0,
  noise: 0,
  blur: 0,
  pixelate: 1,
  cropZoneWidth: 0,
  cropZoneHeight: 0,
  cropRatio: null,
  activeInputName: "",

  // Actions
  setCropZoneWidth: (cropZoneWidth) => set({ cropZoneWidth }),
  setCropZoneHeight: (cropZoneHeight) => set({ cropZoneHeight }),
  setCropRatio: (cropRatio) => set({ cropRatio }),
  setActiveInputName: (activeInputName) => set({ activeInputName }),
  crop: () =>
    set((state) => {
      // Basic crop implementation for fabric.js
      if (state.fabricCanvas && state.imageInstance) {
        // In a real app, this would involve complex fabric logic
        // For now, we'll just log and mock it to maintain component logic
        console.log("Cropping image with:", state.cropZoneWidth, state.cropZoneHeight);
        state.fabricCanvas.renderAll();
      }
      return {};
    }),
  resetImage: () =>
    set((state) => {
      if (state.fabricCanvas && state.imageUrl) {
        // Resetting typically means reloading the original image
        console.log("Resetting image to:", state.imageUrl);
        state.fabricCanvas.clear();
        // ... logic to reload image
      }
      return {
        angle: 0,
        scale: 1,
        flipX: false,
        flipY: false,
      };
    }),

  // Actions
  setFontWeight: (fontWeight) =>
    set((state) => {
      state.fabricCanvas?.getActiveObject()?.set({ fontWeight } as any);
      state.fabricCanvas?.renderAll();
      return { fontWeight };
    }),
  setUnderline: (underline) =>
    set((state) => {
      state.fabricCanvas?.getActiveObject()?.set({ underline } as any);
      state.fabricCanvas?.renderAll();
      return { underline };
    }),
  setFontStyle: (fontStyle) =>
    set((state) => {
      state.fabricCanvas?.getActiveObject()?.set({ fontStyle } as any);
      state.fabricCanvas?.renderAll();
      return { fontStyle };
    }),
  setTextAlign: (textAlign) =>
    set((state) => {
      state.fabricCanvas?.getActiveObject()?.set({ textAlign } as any);
      state.fabricCanvas?.renderAll();
      return { textAlign };
    }),
  setFontSize: (fontSize) =>
    set((state) => {
      const obj = state.fabricCanvas?.getActiveObject();
      if (obj) {
        obj.set({ fontSize } as any);
        obj.set({ scaleX: 1, scaleY: 1 });
        state.fabricCanvas?.renderAll();
      }
      return { fontSize };
    }),
  setLineHeight: (lineHeight) =>
    set((state) => {
      state.fabricCanvas?.getActiveObject()?.set({ lineHeight: 1 + lineHeight / 10 } as any);
      state.fabricCanvas?.renderAll();
      return { lineHeight };
    }),
  setFontColorCode: (fontColorCode) =>
    set((state) => {
      state.fabricCanvas?.getActiveObject()?.set({ fill: `rgb(${fontColorCode})` } as any);
      state.fabricCanvas?.renderAll();
      return { fontColorCode };
    }),
  setIsBgTransparent: (isBgTransparent) =>
    set((state) => {
      const obj = state.fabricCanvas?.getActiveObject();
      if (obj) {
        obj.set({ textBackgroundColor: isBgTransparent ? "transparent" : `rgb(${state.bgColorCode})` } as any);
        state.fabricCanvas?.renderAll();
      }
      return { isBgTransparent };
    }),
  setBgColorCode: (bgColorCode) =>
    set((state) => {
      const obj = state.fabricCanvas?.getActiveObject();
      if (obj && !state.isBgTransparent) {
        obj.set({ textBackgroundColor: `rgb(${bgColorCode})` } as any);
        state.fabricCanvas?.renderAll();
      }
      return { bgColorCode };
    }),
  addText: () =>
    set((state) => {
      if (state.fabricCanvas) {
        const text = new fabric.IText("click to select", {
          left: state.fabricCanvas.width! / 2,
          top: state.fabricCanvas.height! / 2,
          fontSize: state.fontSize,
          fill: `rgb(${state.fontColorCode})`,
          fontWeight: state.fontWeight,
          fontStyle: state.fontStyle,
          underline: state.underline,
          textAlign: state.textAlign,
          lineHeight: 1 + state.lineHeight / 10,
          backgroundColor: state.isBgTransparent ? "transparent" : `rgb(${state.bgColorCode})`,
        }) as any;
        text.name = "text";
        state.fabricCanvas.add(text);
        state.fabricCanvas.setActiveObject(text);
        state.fabricCanvas.renderAll();
      }
      return {};
    }),
  deleteSelectedObject: () =>
    set((state) => {
      if (state.fabricCanvas) {
        const activeObject = state.fabricCanvas.getActiveObject();
        if (activeObject) {
          state.fabricCanvas.remove(activeObject);
          state.fabricCanvas.discardActiveObject();
          state.fabricCanvas.renderAll();
        }
      }
      return { selectedObject: null };
    }),
  setFabricCanvas: (canvas) => set({ fabricCanvas: canvas }),
  setScale: (scale) => set({ scale }),
  setAngle: (angle) => set({ angle }),
  setFlipX: (flipX) => set({ flipX }),
  setFlipY: (flipY) => set({ flipY }),
  setMode: (mode) => set({ mode }),
  toggleToolbar: (mode) =>
    set((state) => ({
      isToolbarOpen: state.mode === mode || !state.isToolbarOpen ? !state.isToolbarOpen : state.isToolbarOpen,
      mode: state.mode === mode ? "" : mode,
    })),
  closeToolbar: () => set({ isToolbarOpen: false, mode: "" }),
  updateHistoryButtons: (canUndo, canRedo) => set({ canUndo, canRedo }),

  setOpacity: (opacity) => set({ opacity }),
  setColorCode: (colorCode) => set({ colorCode }),
  setLineWidth: (lineWidth) =>
    set((state) => {
      if (state.fabricCanvas?.freeDrawingBrush) {
        state.fabricCanvas.freeDrawingBrush.width = lineWidth;
      }
      return { lineWidth };
    }),
  setIsLineStraight: (isLineStraight) => set({ isLineStraight }),

  setImageUrl: (imageUrl) => set({ imageUrl }),
  setImageInstance: (imageInstance) => set({ imageInstance }),
  setImageSize: (imageWidth, imageHeight) => set({ imageWidth, imageHeight }),

  setBrightness: (brightness) =>
    set((state) => {
      state.fabricCanvas?.renderAll();
      return { brightness };
    }),
  setContrast: (contrast) =>
    set((state) => {
      state.fabricCanvas?.renderAll();
      return { contrast };
    }),
  setSaturation: (saturation) =>
    set((state) => {
      state.fabricCanvas?.renderAll();
      return { saturation };
    }),
  setTintColor: (tintColor) =>
    set((state) => {
      state.fabricCanvas?.renderAll();
      return { tintColor };
    }),
  setTintOpacity: (tintOpacity) =>
    set((state) => {
      state.fabricCanvas?.renderAll();
      return { tintOpacity };
    }),
  setInvert: (invert) =>
    set((state) => {
      state.fabricCanvas?.renderAll();
      return { invert };
    }),
  setHue: (hue) =>
    set((state) => {
      state.fabricCanvas?.renderAll();
      return { hue };
    }),
  setNoise: (noise) =>
    set((state) => {
      state.fabricCanvas?.renderAll();
      return { noise };
    }),
  setBlur: (blur) =>
    set((state) => {
      state.fabricCanvas?.renderAll();
      return { blur };
    }),
  setPixelate: (pixelate) =>
    set((state) => {
      state.fabricCanvas?.renderAll();
      return { pixelate };
    }),
  resetEffects: () =>
    set({
      brightness: 0,
      contrast: 0,
      saturation: 0,
      tintColor: "#000",
      tintOpacity: 0,
      invert: 0,
      hue: 0,
      noise: 0,
      blur: 0,
      pixelate: 1,
    }),

  setSelectedObject: (selectedObject) => set({ selectedObject }),
  setNotification: (notification) => set({ notification }),
}));
