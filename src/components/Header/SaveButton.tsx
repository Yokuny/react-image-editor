import { Save } from "lucide-react";
import { useCanvasStore } from "../../hooks/useCanvasStore";
import { useImageStore } from "../../hooks/useImageStore";
import { useUIStore } from "../../hooks/useUIStore";
import Tooltip from "../Tooltip";

const SaveButton: React.FC = () => {
  const { fabricCanvas } = useCanvasStore();
  const { imageUrl } = useImageStore();
  const { isToolbarOpen } = useUIStore();

  const saveImage = () => {
    if (!imageUrl || isToolbarOpen || !fabricCanvas) {
      return;
    }
    const randomNum = Math.floor(Math.random() * 1000);
    const fileName = `image-${randomNum}.png`;
    const link = document.createElement("a");
    link.download = fileName;
    link.href = fabricCanvas.toDataURL({ format: "png", multiplier: 1 });

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Tooltip content="Save" placement="bottom">
      <Save className={`${!imageUrl || isToolbarOpen ? "disabled" : ""}`} onClick={saveImage} />
    </Tooltip>
  );
};
export default SaveButton;
