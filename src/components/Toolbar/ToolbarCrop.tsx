import React, { type ChangeEvent, useEffect, useState } from "react";
import { useCropperStore } from "../../hooks/useCropperStore";
import { useUIStore } from "../../hooks/useUIStore";

const ToolbarCrop: React.FC = () => {
  const { cropZoneWidth, cropZoneHeight, setCropZoneWidth, setCropZoneHeight, setCropRatio, crop, activeInputName, setActiveInputName } = useCropperStore();
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
    const value = parseInt(event.target.value, 10) || 0;
    setLocalWidth(value);
    setCropZoneWidth(value);
  };

  const updateCropZoneHeight = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10) || 0;
    setLocalHeight(value);
    setCropZoneHeight(value);
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
          min={0}
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
          min={0}
          onChange={updateCropZoneHeight}
          onFocus={() => setActiveInputName("height")}
          onBlur={() => {
            setActiveInputName("");
            setLocalHeight(cropZoneHeight);
          }}
        />
      </div>

      <div className="toolbar__block">
        <div className="toolbar__divider"></div>
        <p className="toolbar__block-title">Aspect Ratio</p>
        <div className="toolbar__options">
          {aspectRatioList.map((aspectRatio, index) => {
            return (
              <div
                key={index}
                className={`toolbar__option ${ratio === aspectRatio.name ? "toolbar__option_active" : ""}`}
                onClick={() => {
                  setRatio(aspectRatio.name);
                  setCropRatio(aspectRatio.value);
                }}
              >
                {aspectRatio.name}
              </div>
            );
          })}
        </div>
      </div>
      <button
        className="toolbar__action-btn"
        onClick={() => {
          crop();
          closeToolbar();
        }}
      >
        Apply
      </button>
    </div>
  );
};

export default ToolbarCrop;
