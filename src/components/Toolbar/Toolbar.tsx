import { useObserver } from "mobx-react";
import React from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import { ReactComponent as Close } from "../../assets/close.svg";
import useStore from "../../hooks/useStore";

import ToolbarCrop from "./ToolbarCrop";
import ToolbarDrawing from "./ToolbarDrawing";
import ToolbarEffects from "./ToolbarEffects";
import ToolbarRotate from "./ToolbarRotate";
import ToolbarText from "./ToolbarText";

const Toolbar: React.FC = () => {
  const { UIStore, canvasStore } = useStore();
  const contentMap: { [name: string]: JSX.Element } = {
    // search: <ToolbarSearch />,
    crop: <ToolbarCrop />,
    adjust: <ToolbarRotate />,
    drawing: <ToolbarDrawing />,
    text: <ToolbarText />,
    effects: <ToolbarEffects />,
  };

  return useObserver(() => (
    <TransitionGroup component={null}>
      {UIStore.isToolbarOpen && (
        <CSSTransition timeout={600} classNames="toolbar">
          <section className="toolbar custom-scrollbar">
            <div className="toolbar__header">
              <h4 className="toolbar__title">{canvasStore.mode}</h4>
              <Close
                onClick={() => {
                  canvasStore.resetToBaseScale();
                  UIStore.closeToolbar();
                }}
              />
            </div>
            {contentMap[canvasStore.mode]}
          </section>
        </CSSTransition>
      )}
    </TransitionGroup>
  ));
};

export default Toolbar;
