import "rc-slider/assets/index.css";
import { FlipHorizontal, FlipVertical, RotateCcw, RotateCw } from "lucide-react";
import { useAppStore } from "../../hooks/useAppStore";
import { useCanvasStore } from "../../hooks/useCanvasStore";
import { FlipCommand } from "../../command/flip";
import { RotationCommand } from "../../command/rotation";
import Slider from "../Slider";

const ToolbarRotate: React.FC = () => {
  const { flipX, setFlipX, flipY, setFlipY, angle, scale } = useCanvasStore();

  const pushToHistory = (command: { execute: () => void; undo: () => void; name: string }) => {
    const history = useAppStore.getState().history;
    history.push(command as any);
  };

  const rotateLeft = () => {
    const prevAngle = angle;
    let newAngle = angle - 90;
    if (newAngle < -360) newAngle += 360;

    const command = new RotationCommand(prevAngle, newAngle, scale, scale);
    command.execute();
    pushToHistory(command);
  };

  const rotateRight = () => {
    const prevAngle = angle;
    let newAngle = angle + 90;
    if (newAngle > 360) newAngle -= 360;

    const command = new RotationCommand(prevAngle, newAngle, scale, scale);
    command.execute();
    pushToHistory(command);
  };

  const handleFlipX = () => {
    const command = new FlipCommand(() => setFlipX(!useAppStore.getState().flipX));
    command.execute();
    pushToHistory(command);
  };

  const handleFlipY = () => {
    const command = new FlipCommand(() => setFlipY(!useAppStore.getState().flipY));
    command.execute();
    pushToHistory(command);
  };

  const handleAngleSlider = (value: number) => {
    const prevAngle = angle;
    const command = new RotationCommand(prevAngle, value, scale, scale);
    command.execute();
    pushToHistory(command);
  };

  return (
    <div className="toolbar__content">
      <div className="toolbar__options toolbar__options_one-col">
        <div className={`toolbar__option ${flipX ? "toolbar__option_active" : ""}`} onClick={handleFlipX}>
          <FlipHorizontal /> <p> Flip X</p>
        </div>

        <div className={`toolbar__option ${flipY ? "toolbar__option_active" : ""}`} onClick={handleFlipY}>
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
        callback={handleAngleSlider}
      />
    </div>
  );
};

export default ToolbarRotate;
