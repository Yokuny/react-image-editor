import { RotateCcw } from "lucide-react";
import { useImageStore } from "../../hooks/useImageStore";
import { useUIStore } from "../../hooks/useUIStore";
import Tooltip from "../Tooltip";

export const RefreshButton = () => {
  const { closeToolbar } = useUIStore();
  const { imageUrl, resetImage } = useImageStore();

  return (
    <div>
      <Tooltip content="Refresh" placement="bottom">
        <RotateCcw
          className={`${!imageUrl ? "disabled" : ""}`}
          onClick={() => {
            if (!imageUrl) {
              return;
            }
            resetImage();
            closeToolbar();
          }}
        />
      </Tooltip>
    </div>
  );
};

export default RefreshButton;
