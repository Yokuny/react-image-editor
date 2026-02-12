import { useObserver } from "mobx-react";
import React from "react";
import { ReactComponent as Adjust } from "../assets/adjust.svg";
import { ReactComponent as Crop } from "../assets/crop.svg";
import { ReactComponent as Flip } from "../assets/flip.svg";
import { ReactComponent as Draw } from "../assets/pencil.svg";
import { ReactComponent as Text } from "../assets/text.svg";
import useStore from "../hooks/useStore";
import { ModeName } from "../stores/canvasStore";
import Tooltip from "./Tooltip";

interface IMenuItems {
  icon: React.ReactElement;
  name: ModeName;
  handler: () => void;
  tooltip?: string;
}

const Menu: React.FC = () => {
  const { UIStore, canvasStore, imageStore } = useStore();

  const handleClick = (modeName: ModeName) => {
    if (!imageStore.url) {
      return;
    }

    UIStore.toggleToolbar(modeName);

    if (canvasStore.mode && canvasStore.scale !== 1) {
      canvasStore.setScale(1);
    }

    if (!canvasStore.mode) {
      canvasStore.resetToBaseScale();
    }
  };

  const items: IMenuItems[] = [
    {
      icon: <Crop />,
      name: "crop",
      handler: () => handleClick("crop"),
    },
    {
      icon: <Flip />,
      name: "adjust",
      handler: () => handleClick("adjust"),
    },
    {
      icon: <Draw />,
      name: "drawing",
      handler: () => handleClick("drawing"),
    },
    {
      icon: <Text />,
      name: "text",
      handler: () => handleClick("text"),
    },
    {
      icon: <Adjust />,
      name: "effects",
      handler: () => handleClick("effects"),
    },
  ];
  return useObserver(() => (
    <section className="menu">
      <div className="menu__wrapper">
        {items.map((item, index) => {
          const tooltip = item.tooltip || item.name;
          return (
            <Tooltip key={index} content={tooltip} placement="right">
              <div className={`menu__item ${canvasStore.mode === item.name ? "menu__item_active" : ""} ${!imageStore.url ? "disabled" : ""}`} onClick={item.handler}>
                {item.icon}
              </div>
            </Tooltip>
          );
        })}
      </div>
    </section>
  ));
};

export default Menu;
