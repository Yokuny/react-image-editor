import { Undo2 } from "lucide-react";
import { useAppStore } from "../../hooks/useAppStore";
import { useCanvasStore } from "../../hooks/useCanvasStore";
import { useUIStore } from "../../hooks/useUIStore";
import Tooltip from "../Tooltip";

export const UndoButton = () => {
  const { canUndo } = useUIStore();
  const { konvaStage } = useCanvasStore();

  return (
    <div>
      <Tooltip content="Undo" placement="bottom">
        <Undo2
          className={`${!canUndo ? "disabled" : ""}`}
          onClick={() => {
            if (!canUndo || !konvaStage) {
              return;
            }
            useAppStore.getState().history.undo();
          }}
        />
      </Tooltip>
    </div>
  );
};

export default UndoButton;
