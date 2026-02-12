import React from "react";
import Tooltip from "../Tooltip";
import { useUIStore } from "../../hooks/useUIStore";
import { useCanvasStore } from "../../hooks/useCanvasStore";
import { useAppStore } from "../../hooks/useAppStore";
import Redo from "../../assets/redo.svg";

export const RedoButton = () => {
  const { canRedo } = useUIStore();
  const { fabricCanvas } = useCanvasStore();

  return (
    <div>
      <Tooltip content="Redo" placement="bottom">
        <img
          src={Redo}
          alt="redo"
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
