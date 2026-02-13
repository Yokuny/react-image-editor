import type React from "react";
import { type ChangeEvent, useEffect, useState } from "react";
import { CropCommand } from "../../command/crop";
import { useCropperStore } from "../../hooks/useCropperStore";
import { useAppStore } from "../../hooks/useAppStore";
import { useImageStore } from "../../hooks/useImageStore";
import { useUIStore } from "../../hooks/useUIStore";

const ToolbarCrop: React.FC = () => {
  const { cropZoneWidth, cropZoneHeight, setCropZoneWidth, setCropZoneHeight, setCropX, setCropY, setCropRatio, crop, activeInputName, setActiveInputName, cropRatio } =
    useCropperStore();
  const { imageWidth, imageHeight } = useImageStore();
  const { closeToolbar } = useUIStore();

  const [ratio, setRatio] = useState("custom");
  const [localWidth, setLocalWidth] = useState(cropZoneWidth);
  const [localHeight, setLocalHeight] = useState(cropZoneHeight);

  useEffect(() => {
    if (activeInputName === "") {
      setLocalWidth(cropZoneWidth);
      setLocalHeight(cropZoneHeight);
    } else if (activeInputName === "width") {
      setLocalHeight(cropZoneHeight);
    } else if (activeInputName === "height") {
      setLocalWidth(cropZoneWidth);
    }
  }, [cropZoneWidth, cropZoneHeight, activeInputName]);

  const updateCropZoneWidth = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10) || 0;
    const clampedWidth = Math.max(10, Math.min(value, imageWidth));
    setLocalWidth(clampedWidth);
    setCropZoneWidth(clampedWidth);

    // Enforce aspect ratio
    if (cropRatio) {
      const newHeight = Math.round(clampedWidth / (cropRatio.width / cropRatio.height));
      const clampedHeight = Math.max(10, Math.min(newHeight, imageHeight));
      setCropZoneHeight(clampedHeight);
      setLocalHeight(clampedHeight);
    }

    // Re-center
    setCropX(Math.max(0, Math.round((imageWidth - clampedWidth) / 2)));
  };

  const updateCropZoneHeight = (event: ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10) || 0;
    const clampedHeight = Math.max(10, Math.min(value, imageHeight));
    setLocalHeight(clampedHeight);
    setCropZoneHeight(clampedHeight);

    // Enforce aspect ratio
    if (cropRatio) {
      const newWidth = Math.round(clampedHeight * (cropRatio.width / cropRatio.height));
      const clampedWidth = Math.max(10, Math.min(newWidth, imageWidth));
      setCropZoneWidth(clampedWidth);
      setLocalWidth(clampedWidth);
    }

    // Re-center
    setCropY(Math.max(0, Math.round((imageHeight - clampedHeight) / 2)));
  };

  const selectAspectRatio = (name: string, value: { width: number; height: number } | null) => {
    setRatio(name);
    setCropRatio(value);

    if (value && imageWidth > 0 && imageHeight > 0) {
      const ratioValue = value.width / value.height;
      let cropW = imageWidth;
      let cropH = imageWidth / ratioValue;
      if (cropH > imageHeight) {
        cropH = imageHeight;
        cropW = imageHeight * ratioValue;
      }
      cropW = Math.round(cropW);
      cropH = Math.round(cropH);
      setCropZoneWidth(cropW);
      setCropZoneHeight(cropH);
      setCropX(Math.round((imageWidth - cropW) / 2));
      setCropY(Math.round((imageHeight - cropH) / 2));
    } else if (!value && imageWidth > 0 && imageHeight > 0) {
      // Custom: reset to full image
      setCropZoneWidth(imageWidth);
      setCropZoneHeight(imageHeight);
      setCropX(0);
      setCropY(0);
    }
  };

  const aspectRatioList = [
    { name: "custom", value: null },
    { name: "1:1", value: { width: 1, height: 1 } },
    { name: "3:2", value: { width: 3, height: 2 } },
    { name: "4:3", value: { width: 4, height: 3 } },
    { name: "5:4", value: { width: 5, height: 4 } },
    { name: "7:5", value: { width: 7, height: 5 } },
    { name: "14:9", value: { width: 14, height: 9 } },
    { name: "16:9", value: { width: 16, height: 9 } },
  ];

  return (
    <div className="toolbar__content">
      <div className="toolbar__form">
        <p className="toolbar__form-label">Width</p>
        <input
          type="number"
          className="toolbar__form-input"
          value={Math.floor(localWidth)}
          min={10}
          max={imageWidth}
          onChange={updateCropZoneWidth}
          onFocus={() => setActiveInputName("width")}
          onBlur={() => {
            setActiveInputName("");
            setLocalWidth(cropZoneWidth);
          }}
        />
        <p className="toolbar__form-label">Height</p>
        <input
          type="number"
          className="toolbar__form-input"
          value={Math.floor(localHeight)}
          min={10}
          max={imageHeight}
          onChange={updateCropZoneHeight}
          onFocus={() => setActiveInputName("height")}
          onBlur={() => {
            setActiveInputName("");
            setLocalHeight(cropZoneHeight);
          }}
        />
      </div>

      <div className="toolbar__block">
        <div className="toolbar__divider" />
        <p className="toolbar__block-title">Aspect Ratio</p>
        <div className="toolbar__options">
          {aspectRatioList.map((aspectRatio) => (
            <button
              type="button"
              key={aspectRatio.name}
              className={`toolbar__option ${ratio === aspectRatio.name ? "toolbar__option_active" : ""}`}
              onClick={() => selectAspectRatio(aspectRatio.name, aspectRatio.value)}
            >
              {aspectRatio.name}
            </button>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="toolbar__action-btn"
        onClick={() => {
          const command = new CropCommand("", []);
          crop();
          const newImageUrl = useAppStore.getState().imageUrl;
          (command as any).imageUrl = newImageUrl;
          useAppStore.getState().history.push(command);
          closeToolbar();
        }}
      >
        Apply
      </button>
    </div>
  );
};

export default ToolbarCrop;
