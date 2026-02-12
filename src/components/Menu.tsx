import React from "react";
import Adjust from "../assets/adjust.svg";
import Crop from "../assets/crop.svg";
import Flip from "../assets/flip.svg";
import Draw from "../assets/pencil.svg";
import Text from "../assets/text.svg";
import { useUIStore } from "../hooks/useUIStore";
import { useCanvasStore } from "../hooks/useCanvasStore";
import { useImageStore } from "../hooks/useImageStore";
import type { ModeName } from "../hooks/useAppStore";
import Tooltip from "./Tooltip";

interface IMenuItems {
  icon: React.ReactElement;
  name: ModeName;
  handler: () => void;
  tooltip?: string;
}

const Menu: React.FC = () => {
  const { toggleToolbar } = useUIStore();
  const { mode, scale, setScale } = useCanvasStore();
  const { imageUrl } = useImageStore();

  const handleClick = (modeName: ModeName) => {
    if (!imageUrl) {
      return;
    }

    toggleToolbar(modeName);

    if (mode && scale !== 1) {
      setScale(1);
    }

    // Logic for resetToBaseScale will be handled in the store or components if needed
  };

  const items: IMenuItems[] = [
    {
      icon: <img src={Crop} alt="crop" />,
      name: "crop",
      handler: () => handleClick("crop"),
    },
    {
      icon: <img src={Flip} alt="adjust" />,
      name: "adjust",
      handler: () => handleClick("adjust"),
    },
    {
      icon: <img src={Draw} alt="drawing" />,
      name: "drawing",
      handler: () => handleClick("drawing"),
    },
    {
      icon: <img src={Text} alt="text" />,
      name: "text",
      handler: () => handleClick("text"),
    },
    {
      icon: <img src={Adjust} alt="effects" />,
      name: "effects",
      handler: () => handleClick("effects"),
    },
  ];

  return (
    <section className="menu">
      <div className="menu__wrapper">
        {items.map((item, index) => {
          const tooltip = item.tooltip || item.name;
          return (
            <Tooltip key={index} content={tooltip} placement="right">
              <div className={`menu__item ${mode === item.name ? "menu__item_active" : ""} ${!imageUrl ? "disabled" : ""}`} onClick={item.handler}>
                {item.icon}
              </div>
            </Tooltip>
          );
        })}
      </div>
    </section>
  );
};

export default Menu;
