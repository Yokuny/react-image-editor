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
    for (const { id, value } of values) {
      updates[id] = value;
    }

    useAppStore.setState(updates);
    store.konvaStage?.batchDraw();
  }
}
