import type * as fabric from "fabric";
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
  fabricCanvas: fabric.Canvas | null;

  // UI State
  isToolbarOpen: boolean;
  canUndo: boolean;
  canRedo: boolean;

  // Image State
  imageUrl: string;
  imageInstance: fabric.Image | null;
  imageWidth: number;
  imageHeight: number;

  // Object Manager State
  selectedObject: fabric.Object | null;
  notification: { type: string; data: unknown };

  // Actions
  setFabricCanvas: (canvas: fabric.Canvas) => void;
  setScale: (scale: number) => void;
  setAngle: (angle: number) => void;
  setFlipX: (flipX: boolean) => void;
  setFlipY: (flipY: boolean) => void;
  setMode: (mode: ModeName) => void;
  toggleToolbar: (mode: ModeName) => void;
  closeToolbar: () => void;
  updateHistoryButtons: (canUndo: boolean, canRedo: boolean) => void;

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
  cropRatio: null,
  activeInputName: "",

  // Actions
  setCropZoneWidth: (cropZoneWidth) => set({ cropZoneWidth }),
  setCropZoneHeight: (cropZoneHeight) => set({ cropZoneHeight }),
  setCropRatio: (cropRatio) => set({ cropRatio }),
  setActiveInputName: (activeInputName) => set({ activeInputName }),
  crop: () =>
    set((state) => {
      if (state.fabricCanvas && state.imageInstance) {
        console.log("Cropping image with:", state.cropZoneWidth, state.cropZoneHeight);
        state.fabricCanvas.renderAll();
      }
      return {};
    }),
  resetImage: () =>
    set((state) => {
      if (state.fabricCanvas && state.imageUrl) {
        console.log("Resetting image to:", state.imageUrl);
        state.fabricCanvas.clear();
      }
      return {
        angle: 0,
        scale: 1,
        flipX: false,
        flipY: false,
      };
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
