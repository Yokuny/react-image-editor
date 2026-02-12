import React from "react";
import Tooltip from "../Tooltip";
import Refresh from "../../assets/refresh.svg";
import { useUIStore } from "../../hooks/useUIStore";
import { useImageStore } from "../../hooks/useImageStore";

export const RefreshButton = () => {
  const { closeToolbar } = useUIStore();
  const { url, resetImage } = useImageStore();

  return (
    <div>
      <Tooltip content="Refresh" placement="bottom">
        <img
          src={Refresh}
          alt="refresh"
          className={`${!url ? "disabled" : ""}`}
          onClick={() => {
            if (!url) {
              return;
            }
            resetImage();
            closeToolbar();
          }}
        />
      </Tooltip>
    </div>
  );
};

export default RefreshButton;
