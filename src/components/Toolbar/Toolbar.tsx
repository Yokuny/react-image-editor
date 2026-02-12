import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import Close from "../../assets/close.svg";
import { useUIStore } from "../../hooks/useUIStore";
import { useCanvasStore } from "../../hooks/useCanvasStore";

import ToolbarCrop from "./ToolbarCrop";
import ToolbarDrawing from "./ToolbarDrawing";
import ToolbarEffects from "./ToolbarEffects";
import ToolbarRotate from "./ToolbarRotate";
import ToolbarText from "./ToolbarText";

const Toolbar: React.FC = () => {
  const { isToolbarOpen, closeToolbar } = useUIStore();
  const { mode } = useCanvasStore();

  const contentMap: { [name: string]: React.JSX.Element } = {
    crop: <ToolbarCrop />,
    adjust: <ToolbarRotate />,
    drawing: <ToolbarDrawing />,
    text: <ToolbarText />,
    effects: <ToolbarEffects />,
  };

  return (
    <TransitionGroup component={null}>
      {isToolbarOpen && (
        <CSSTransition timeout={600} classNames="toolbar">
          <section className="toolbar custom-scrollbar">
            <div className="toolbar__header">
              <h4 className="toolbar__title">{mode}</h4>
              <img
                src={Close}
                alt="close"
                onClick={() => {
                  // Logic for resetToBaseScale could be handled in closeToolbar action if desired
                  closeToolbar();
                }}
              />
            </div>
            {contentMap[mode]}
          </section>
        </CSSTransition>
      )}
    </TransitionGroup>
  );
};

export default Toolbar;
