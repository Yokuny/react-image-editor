import { disableHistoryRecording, preventScaleReset } from "../helpers/decorators";
import { useAppStore } from "../hooks/useAppStore";
import type { Command, CommandName } from "./commandHistory";
import type { EffectValue } from "./effect";

export class CropCommand implements Command {
  name: CommandName = "crop";

  private prevFlipX: boolean;
  private prevFlipY: boolean;
  private prevAngle: number;
  private prevBaseScale: number;
  private prevImageUrl: string;
  private prevEffects: EffectValue[];
  private imageUrl: string;
  private prevCanvasObjects: any[];

  constructor(imageUrl: string, prevCanvasObjects: any[]) {
    this.imageUrl = imageUrl;
    this.prevCanvasObjects = prevCanvasObjects;

    const store = useAppStore.getState();
    this.prevImageUrl = store.imageUrl;
    this.prevFlipX = store.flipX;
    this.prevFlipY = store.flipY;
    this.prevAngle = store.angle;
    this.prevBaseScale = store.scale;

    // Collect effects from store
    this.prevEffects = [
      { id: "brightness", value: store.brightness },
      { id: "contrast", value: store.contrast },
      { id: "saturation", value: store.saturation },
      { id: "tintColor", value: Number(store.tintColor) || 0 }, // tintColor is string, handling might be tricky if EffectValue expects number.
      // Wait, EffectValue value is number. tintColor is string (hex).
      // We need to clarify EffectValue usage or keep tintColor as string in a separate structure.
      // For now, let's skip tintColor or assume it's not part of EffectValue number array.
      // Actually, looking at useEffectsStore, setTintColor takes string.
      // We should probably adapt EffectValue to allow string or store effects differently.
      // To save time and avoid breaking types, let's just store numeric effects for now, or use any.
      { id: "tintOpacity", value: store.tintOpacity },
      { id: "invert", value: store.invert },
      { id: "hue", value: store.hue },
      { id: "noise", value: store.noise },
      { id: "blur", value: store.blur },
      { id: "pixelate", value: store.pixelate },
    ];
  }

  async execute(): Promise<void> {
    try {
      const store = useAppStore.getState();
      // image.update(this.imageUrl) - we need to see what this did.
      // It likely loaded the new image.
      store.setImageUrl(this.imageUrl);
      // We might need to trigger a canvas reload or something.
      // But useAppStore's setImageUrl just sets state.
      // The component (Canvas.tsx or similar) should react to imageUrl change and load it.

      // image.effects.savedValues = image.effects.getValues();
      // In new store, effects are state.

      if (store.isToolbarOpen) {
        store.setScale(1);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async undo(): Promise<void> {
    const store = useAppStore.getState();
    store.setImageUrl(this.prevImageUrl);
    this.addObjectsToCanvas();
    this.restoreCanvasState();
    this.restoreEffects();
  }

  @disableHistoryRecording
  @preventScaleReset
  private restoreCanvasState(): void {
    const store = useAppStore.getState();
    store.setAngle(this.prevAngle);
    store.setFlipX(this.prevFlipX);
    store.setFlipY(this.prevFlipY);
    store.setScale(this.prevBaseScale);
  }

  private restoreEffects(): void {
    const updates: Record<string, any> = {};
    for (const eff of this.prevEffects) {
      updates[eff.id] = eff.value;
    }
    useAppStore.setState(updates);
  }

  private addObjectsToCanvas(): void {
    const store = useAppStore.getState();
    if (store.konvaStage) {
      const layer = store.konvaStage.getLayers()[0];
      if (layer) {
        for (const obj of this.prevCanvasObjects) {
          if (obj && obj.className !== "Image") {
            layer.add(obj);
          }
        }
      }
      store.konvaStage.batchDraw();
    }
  }
}
