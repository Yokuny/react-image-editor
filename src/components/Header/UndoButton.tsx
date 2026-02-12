import { Undo2 } from "lucide-react";
import Tooltip from "../Tooltip";
import { useUIStore } from "../../hooks/useUIStore";
import { useCanvasStore } from "../../hooks/useCanvasStore";
import { useAppStore } from "../../hooks/useAppStore";

export const UndoButton = () => {
  const { canUndo } = useUIStore();
  const { fabricCanvas } = useCanvasStore();

  return (
    <div>
      <Tooltip content="Undo" placement="bottom">
        <Undo2
          className={`${!canUndo ? "disabled" : ""}`}
          onClick={() => {
            if (!canUndo || !fabricCanvas) {
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
