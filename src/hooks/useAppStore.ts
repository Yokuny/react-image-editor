import type Konva from "konva";
import { create } from "zustand";
import { History } from "../command/commandHistory";

export type ModeName = "crop" | "adjust" | "effects" | "";

export interface AppState {
  // Global Singleton
  history: History;

  // Canvas State
  scale: number;
  angle: number;
  flipX: boolean;
  flipY: boolean;
  mode: ModeName;
  konvaStage: Konva.Stage | null;

  // UI State
  isToolbarOpen: boolean;
  canUndo: boolean;
  canRedo: boolean;

  // Image State
  imageUrl: string;
  imageInstance: HTMLImageElement | null;
  imageWidth: number;
  imageHeight: number;

  // Object Manager State
  selectedObject: Konva.Node | null;
  notification: { type: string; data: unknown };

  // Actions
  setKonvaStage: (stage: Konva.Stage) => void;
  setScale: (scale: number) => void;
  setAngle: (angle: number) => void;
  setFlipX: (flipX: boolean) => void;
  setFlipY: (flipY: boolean) => void;
  setMode: (mode: ModeName) => void;
  toggleToolbar: (mode: ModeName) => void;
  closeToolbar: () => void;
  updateHistoryButtons: (canUndo: boolean, canRedo: boolean) => void;

  setImageUrl: (url: string) => void;
  setImageInstance: (instance: HTMLImageElement | null) => void;
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
  cropX: number;
  cropY: number;
  cropRatio: { width: number; height: number } | null;
  activeInputName: string;

  setCropZoneWidth: (width: number) => void;
  setCropZoneHeight: (height: number) => void;
  setCropX: (x: number) => void;
  setCropY: (y: number) => void;
  setCropRatio: (ratio: { width: number; height: number } | null) => void;
  setActiveInputName: (name: string) => void;
  crop: () => void;
  resetImage: () => void;

  setSelectedObject: (obj: Konva.Node | null) => void;
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
  konvaStage: null,
  isToolbarOpen: false,
  canUndo: false,
  canRedo: false,
  imageUrl: "",
  imageInstance: null,
  imageWidth: 0,
  imageHeight: 0,
  selectedObject: null,
  notification: { type: "", data: null },
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
  cropX: 0,
  cropY: 0,
  cropRatio: null,
  activeInputName: "",

  // Actions
  setCropZoneWidth: (cropZoneWidth) => set({ cropZoneWidth }),
  setCropZoneHeight: (cropZoneHeight) => set({ cropZoneHeight }),
  setCropX: (cropX) => set({ cropX }),
  setCropY: (cropY) => set({ cropY }),
  setCropRatio: (cropRatio) => set({ cropRatio }),
  setActiveInputName: (activeInputName) => set({ activeInputName }),
  crop: () =>
    set((state) => {
      if (state.imageInstance && state.cropZoneWidth > 0 && state.cropZoneHeight > 0) {
        const img = state.imageInstance;
        const cw = Math.min(state.cropZoneWidth, img.naturalWidth);
        const ch = Math.min(state.cropZoneHeight, img.naturalHeight);
        const cx = Math.max(0, Math.min(state.cropX, img.naturalWidth - cw));
        const cy = Math.max(0, Math.min(state.cropY, img.naturalHeight - ch));

        const offscreen = document.createElement("canvas");
        offscreen.width = cw;
        offscreen.height = ch;
        const ctx = offscreen.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, cx, cy, cw, ch, 0, 0, cw, ch);
          const dataUrl = offscreen.toDataURL("image/png");
          return {
            imageUrl: dataUrl,
            imageWidth: cw,
            imageHeight: ch,
            angle: 0,
            scale: 1,
            flipX: false,
            flipY: false,
          };
        }
      }
      return {};
    }),
  resetImage: () =>
    set(() => ({
      angle: 0,
      scale: 1,
      flipX: false,
      flipY: false,
    })),

  setKonvaStage: (stage) => set({ konvaStage: stage }),
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

  setImageUrl: (imageUrl) => set({ imageUrl }),
  setImageInstance: (imageInstance) => set({ imageInstance }),
  setImageSize: (imageWidth, imageHeight) => set({ imageWidth, imageHeight }),

  setBrightness: (brightness) =>
    set((state) => {
      state.konvaStage?.batchDraw();
      return { brightness };
    }),
  setContrast: (contrast) =>
    set((state) => {
      state.konvaStage?.batchDraw();
      return { contrast };
    }),
  setSaturation: (saturation) =>
    set((state) => {
      state.konvaStage?.batchDraw();
      return { saturation };
    }),
  setTintColor: (tintColor) =>
    set((state) => {
      state.konvaStage?.batchDraw();
      return { tintColor };
    }),
  setTintOpacity: (tintOpacity) =>
    set((state) => {
      state.konvaStage?.batchDraw();
      return { tintOpacity };
    }),
  setInvert: (invert) =>
    set((state) => {
      state.konvaStage?.batchDraw();
      return { invert };
    }),
  setHue: (hue) =>
    set((state) => {
      state.konvaStage?.batchDraw();
      return { hue };
    }),
  setNoise: (noise) =>
    set((state) => {
      state.konvaStage?.batchDraw();
      return { noise };
    }),
  setBlur: (blur) =>
    set((state) => {
      state.konvaStage?.batchDraw();
      return { blur };
    }),
  setPixelate: (pixelate) =>
    set((state) => {
      state.konvaStage?.batchDraw();
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
