import { useAppStore } from "../hooks/useAppStore";
import type { Command, CommandName } from "./commandHistory";

export interface EffectValue {
  id: string;
  value: number;
}

export class EffectCommand implements Command {
  name: CommandName = "effect";

  private previousValues: EffectValue[];
  private currentValues: EffectValue[];

  constructor(previousValues: EffectValue[], currentValues: EffectValue[]) {
    this.previousValues = previousValues;
    this.currentValues = currentValues;
  }

  undo(): void {
    this.setEffect(this.previousValues);
  }

  execute(): void {
    this.setEffect(this.currentValues);
  }

  setEffect(values: EffectValue[]): void {
    const store = useAppStore.getState();
    const updates: Record<string, number> = {};
    values.forEach(({ id, value }) => {
      updates[id] = value;
    });
    // This is a direct state update, bypassing specific setters if they have side effects beyond setting state.
    // However, specific setters call renderAll(), which we likely want.
    // So we should probably call specific setters or a bulk update method.
    // For now, let's just use setState and force a render.
    useAppStore.setState(updates);
    store.fabricCanvas?.renderAll();
  }
}
