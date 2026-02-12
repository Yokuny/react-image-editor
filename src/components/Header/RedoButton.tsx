import { Redo2 } from "lucide-react";
import { useAppStore } from "../../hooks/useAppStore";
import { useCanvasStore } from "../../hooks/useCanvasStore";
import { useUIStore } from "../../hooks/useUIStore";
import Tooltip from "../Tooltip";

export const RedoButton = () => {
  const { canRedo } = useUIStore();
  const { konvaStage } = useCanvasStore();

  return (
    <div>
      <Tooltip content="Redo" placement="bottom">
        <Redo2
          className={`${!canRedo ? "disabled" : ""}`}
          onClick={() => {
            if (!canRedo || !konvaStage) {
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
