import { useUIStore } from "../../hooks/useUIStore";
import RedoButton from "./RedoButton";
import SaveButton from "./SaveButton";
import UndoButton from "./UndoButton";
import UploadButton from "./UploadButton";
import ZoomControl from "./ZoomControl";

const Header: React.FC = () => {
  const { isToolbarOpen } = useUIStore();

  return (
    <header className={`header ${isToolbarOpen ? "header_toolbar-open" : ""}`}>
      <div className="header__items">
        <div className="header__items-group">
          <div className="header__item">
            <UndoButton />
          </div>
          <div className="header__item">
            <RedoButton />
          </div>
        </div>
        <div className="header__items-group">
          <div className="header__item">
            <ZoomControl />
          </div>
        </div>
        <div className="header__items-group">
          <div className="header__item">
            <UploadButton />
          </div>
          <div className="header__item">
            <SaveButton />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
