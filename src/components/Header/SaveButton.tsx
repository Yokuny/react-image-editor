import { Download } from "lucide-react";
import { useCanvasStore } from "../../hooks/useCanvasStore";
import { useImageStore } from "../../hooks/useImageStore";
import { useUIStore } from "../../hooks/useUIStore";
import Tooltip from "../Tooltip";

const SaveButton: React.FC = () => {
  const { konvaStage } = useCanvasStore();
  const { imageUrl } = useImageStore();
  const { isToolbarOpen } = useUIStore();

  const saveImage = () => {
    if (!imageUrl || isToolbarOpen || !konvaStage) {
      return;
    }

    try {
      // Export the stage as PNG with all effects, transformations, and crop applied
      const dataURL = konvaStage.toDataURL({
        mimeType: "image/png",
        quality: 1,
        pixelRatio: 2, // Higher quality export (2x resolution)
      });

      // Generate filename with timestamp
      const now = new Date();
      const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, -5);
      const fileName = `edited-image-${timestamp}.png`;

      // Create download link
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataURL;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  return (
    <Tooltip content="Download Image" placement="bottom">
      <Download className={`${!imageUrl || isToolbarOpen ? "disabled" : ""}`} onClick={saveImage} />
    </Tooltip>
  );
};

export default SaveButton;
