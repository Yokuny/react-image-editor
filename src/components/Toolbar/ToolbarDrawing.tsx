import Slider from "../Slider";
import ColorPicker from "../ColorPicker";
import { useDrawingStore } from "../../hooks/useDrawingStore";
import ToggleButton from "../ToggleButton";

const ToolbarDrawing: React.FC = () => {
  const { colorCode, setColorCode, lineWidth, setLineWidth, opacity, setOpacity, isLineStraight, setIsLineStraight } = useDrawingStore();

  return (
    <div className="toolbar__content">
      <ColorPicker title="Colors" currentColorCode={colorCode} callback={(rgbCode) => setColorCode(rgbCode)} />
      <Slider title="Width" value={lineWidth} min={1} max={150} callback={(value) => setLineWidth(value)} />
      <Slider title="Opacity" value={Math.round(opacity * 100)} min={0} max={100} callback={(value) => setOpacity(value / 100)} />
      <ToggleButton
        title="Straight Line"
        checked={isLineStraight}
        callback={() => setIsLineStraight(!isLineStraight)} // Note: I simplified this for now
      />
    </div>
  );
};

export default ToolbarDrawing;
