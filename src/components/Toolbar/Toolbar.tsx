import { X } from "lucide-react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useCanvasStore } from "../../hooks/useCanvasStore";
import { useUIStore } from "../../hooks/useUIStore";

import ToolbarCrop from "./ToolbarCrop";
import ToolbarEffects from "./ToolbarEffects";
import ToolbarRotate from "./ToolbarRotate";

const Toolbar: React.FC = () => {
  const { isToolbarOpen, closeToolbar } = useUIStore();
  const { mode } = useCanvasStore();

  const contentMap: { [name: string]: React.JSX.Element } = {
    crop: <ToolbarCrop />,
    adjust: <ToolbarRotate />,
    effects: <ToolbarEffects />,
  };

  return (
    <TransitionGroup component={null}>
      {isToolbarOpen && (
        <CSSTransition timeout={600} classNames="toolbar">
          <section className="toolbar custom-scrollbar">
            <div className="toolbar__header">
              <h4 className="toolbar__title">{mode}</h4>
              <X
                onClick={() => {
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
