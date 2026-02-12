import { Redo2 } from "lucide-react";
import Tooltip from "../Tooltip";
import { useUIStore } from "../../hooks/useUIStore";
import { useCanvasStore } from "../../hooks/useCanvasStore";
import { useAppStore } from "../../hooks/useAppStore";

export const RedoButton = () => {
  const { canRedo } = useUIStore();
  const { fabricCanvas } = useCanvasStore();

  return (
    <div>
      <Tooltip content="Redo" placement="bottom">
        <Redo2
          className={`${!canRedo ? "disabled" : ""}`}
          onClick={() => {
            if (!canRedo || !fabricCanvas) {
              return;
            }
            useAppStore.getState().history.redo();
          }}
        />
      </Tooltip>
    </div>
  );
};

export default RedoButton;
