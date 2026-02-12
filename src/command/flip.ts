import { disableHistoryRecording, preventScaleReset } from "../helpers/decorators";
import type { Command, CommandName } from "./commandHistory";

export class FlipCommand implements Command {
  name: CommandName = "flip";

  constructor(private flip: () => void) {}

  @disableHistoryRecording
  @preventScaleReset
  execute(): void {
    this.flip();
  }

  @disableHistoryRecording
  @preventScaleReset
  undo(): void {
    this.flip();
  }
}
