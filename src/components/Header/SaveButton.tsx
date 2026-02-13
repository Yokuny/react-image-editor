import { Download } from "lucide-react";
import { useCanvasStore } from "../../hooks/useCanvasStore";
import { useImageStore } from "../../hooks/useImageStore";
import Tooltip from "../Tooltip";

const SaveButton: React.FC = () => {
  const { imageUrl } = useImageStore();
  const { konvaStage } = useCanvasStore();

  const saveImage = () => {
    if (!imageUrl || !konvaStage) {
      return;
    }

    try {
      const dataURL = konvaStage.toDataURL({
        mimeType: "image/png",
        quality: 1,
        pixelRatio: 2,
      });

      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, -5);
      const fileName = `edited-image-${timestamp}.png`;

      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataURL;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {}
  };

  return (
    <Tooltip content="Download Image" placement="bottom">
      <Download className={`${!imageUrl ? "disabled" : ""}`} onClick={saveImage} />
    </Tooltip>
  );
};

export default SaveButton;
