import React from "react";
import Bold from "../../assets/bold.svg";
import Underline from "../../assets/underline.svg";
import Italic from "../../assets/italic.svg";
import AlignLeft from "../../assets/align-left.svg";
import AlignCenter from "../../assets/align-center.svg";
import AlignRight from "../../assets/align-right.svg";
import Slider from "../Slider";
import ColorPicker from "../ColorPicker";
import ToggleButton from "../ToggleButton";
import { useTextStore } from "../../hooks/useTextStore";
import { useObjectManagerStore } from "../../hooks/useObjectManagerStore";
import { TextConstants as TextСonstants } from "../../helpers/textConstants";

const ToolbarText: React.FC = () => {
  const {
    fontWeight,
    setFontWeight,
    underline,
    setUnderline,
    fontStyle,
    setFontStyle,
    textAlign,
    setTextAlign,
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    fontColorCode,
    setFontColorCode,
    isBgTransparent,
    setIsBgTransparent,
    bgColorCode,
    setBgColorCode,
    addText,
    deleteSelectedObject,
  } = useTextStore();

  const { selectedObject } = useObjectManagerStore();

  const options = [
    {
      icon: <img src={Bold} alt="Bold" />,
      name: "fontWeight",
      handler: () => setFontWeight(fontWeight === "bold" ? "normal" : "bold"),
      isActive: (val: string) => val === "bold",
    },
    {
      icon: <img src={Underline} alt="Underline" />,
      name: "underline",
      handler: () => setUnderline(!underline),
      isActive: (val: boolean) => val,
    },
    {
      icon: <img src={Italic} alt="Italic" />,
      name: "fontStyle",
      handler: () => setFontStyle(fontStyle === "italic" ? "normal" : "italic"),
      isActive: (val: string) => val === "italic",
    },
    {
      icon: <img src={AlignLeft} alt="Align Left" />,
      name: "textAlign",
      handler: () => setTextAlign("left"),
      isActive: (val: string) => val === "left",
    },
    {
      icon: <img src={AlignCenter} alt="Align Center" />,
      name: "textAlign",
      handler: () => setTextAlign("center"),
      isActive: (val: string) => val === "center",
    },
    {
      icon: <img src={AlignRight} alt="Align Right" />,
      name: "textAlign",
      handler: () => setTextAlign("right"),
      isActive: (val: string) => val === "right",
    },
  ];

  return (
    <div className="toolbar__content">
      <button onClick={addText} className="toolbar__action-btn">
        Add Text
      </button>
      {selectedObject ? (
        <>
          <div className="toolbar__options toolbar__options_three-col">
            {options.map((option, index) => {
              const optionValue = option.name === "fontWeight" ? fontWeight : option.name === "underline" ? underline : option.name === "fontStyle" ? fontStyle : textAlign;
              return (
                <div key={index} className={`toolbar__option ${option.isActive(optionValue as any) ? "toolbar__option_active" : ""}`} onClick={option.handler}>
                  {option.icon}
                </div>
              );
            })}
          </div>
          <Slider title="Size" value={Math.floor(fontSize)} min={TextСonstants.MIN_FONT_SIZE} max={TextСonstants.MAX_FONT_SIZE} callback={(value) => setFontSize(value)} />
          <Slider title="Line height" value={lineHeight} min={TextСonstants.MIN_LINE_HEIGHT} max={TextСonstants.MAX_LINE_HEIGHT} callback={(value) => setLineHeight(value)} />
          <ColorPicker title="Colors" currentColorCode={fontColorCode} callback={(rgbCode) => setFontColorCode(rgbCode)} />
          <ToggleButton title="Background" checked={!isBgTransparent} callback={() => setIsBgTransparent(!isBgTransparent)} />
          {!isBgTransparent && <ColorPicker currentColorCode={bgColorCode} callback={(rgbCode) => setBgColorCode(rgbCode)} />}
          <button className="toolbar__action-btn" onClick={deleteSelectedObject}>
            Remove
          </button>
        </>
      ) : null}
    </div>
  );
};

export default ToolbarText;
