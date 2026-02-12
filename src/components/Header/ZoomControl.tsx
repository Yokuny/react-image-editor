import { Plus, Minus } from "lucide-react";
import Tooltip from "../Tooltip";
import { useCanvasStore } from "../../hooks/useCanvasStore";
import { useImageStore } from "../../hooks/useImageStore";

const ZoomControl: React.FC = () => {
  const { scale, setScale, mode } = useCanvasStore();
  const { imageUrl } = useImageStore();

  const increaseScale = () => {
    setScale(Math.min(scale + 0.1, 5));
  };

  const decreaseScale = () => {
    setScale(Math.max(scale - 0.1, 0.1));
  };

  if (!imageUrl || mode) {
    return null;
  }

  return (
    <div className="zoom-control">
      <button className="zoom-control__zoom-in" onClick={increaseScale}>
        <Tooltip content="Zoom In" placement="top">
          <Plus />
        </Tooltip>
      </button>
      <p className="zoom-control__value">{`${Math.floor(scale * 100)}%`}</p>
      <button className="zoom-control__zoom-out" onClick={decreaseScale}>
        <Tooltip content="Zoom Out" placement="top">
          <Minus />
        </Tooltip>
      </button>
    </div>
  );
};

export default ZoomControl;
