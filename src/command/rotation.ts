import { preventScaleReset } from "../helpers/decorators";
import { useAppStore } from "../hooks/useAppStore";
import type { Command, CommandName } from "./commandHistory";

export class RotationCommand implements Command {
  name: CommandName = "rotate";

  private prevAngle: number;
  private angle: number;
  private prevBaseScale: number;
  private baseScale: number;

  constructor(prevAngle: number, angle: number, prevBaseScale: number, baseScale: number) {
    this.prevAngle = prevAngle;
    this.angle = angle;
    this.prevBaseScale = prevBaseScale;
    this.baseScale = baseScale;
  }

  @preventScaleReset
  execute(): void {
    const store = useAppStore.getState();
    store.setAngle(this.angle);
    store.setScale(this.baseScale);
  }

  @preventScaleReset
  undo(): void {
    const store = useAppStore.getState();
    store.setAngle(this.prevAngle);
    store.setScale(this.prevBaseScale);
  }
}
