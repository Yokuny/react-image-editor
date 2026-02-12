import { useCanvasStore } from "../../hooks/useCanvasStore";
import "rc-slider/assets/index.css";
import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical } from "lucide-react";
import Slider from "../Slider";

const ToolbarRotate: React.FC = () => {
  const {
    flipX,
    setFlipX,
    flipY,
    setFlipY,
    angle,
    setAngle,
    // Note: rotateRight/Left should be actions in the store if we want to follow the same logic
  } = useCanvasStore();

  const rotateLeft = () => {
    let newAngle = angle - 90;
    if (newAngle < -360) newAngle += 360;
    setAngle(newAngle);
  };

  const rotateRight = () => {
    let newAngle = angle + 90;
    if (newAngle > 360) newAngle -= 360;
    setAngle(newAngle);
  };

  return (
    <div className="toolbar__content">
      <div className="toolbar__options toolbar__options_one-col">
        <div className={`toolbar__option ${flipX ? "toolbar__option_active" : ""}`} onClick={() => setFlipX(!flipX)}>
          <FlipHorizontal /> <p> Flip X</p>
        </div>

        <div className={`toolbar__option ${flipY ? "toolbar__option_active" : ""}`} onClick={() => setFlipY(!flipY)}>
          <FlipVertical /> <p> Flip Y</p>
        </div>

        <div className="toolbar__option" onClick={rotateLeft}>
          <RotateCcw /> <p> Rotate Left</p>
        </div>

        <div className="toolbar__option" onClick={rotateRight}>
          <RotateCw /> <p> Rotate Right</p>
        </div>
      </div>
      <Slider
        title="Angle"
        value={angle}
        min={-360}
        max={360}
        startPoint={0}
        marks={{
          360: "360°",
          0: "0°",
          "-360": "-360°",
          180: "180°",
          "-180": "-180°",
        }}
        callback={(value) => setAngle(value)}
      />
    </div>
  );
};

export default ToolbarRotate;
