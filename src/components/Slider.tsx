import RcSlider from "rc-slider";
import type { JSX } from "react";

type Props = {
  title: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  startPoint?: number;
  marks?: any;
  renderIcon?: () => JSX.Element;
  callback: (value: number) => void;
  onBeforeChange?: () => void;
  onAfterChange?: () => void;
};

const Slider: React.FC<Props> = (props) => {
  const { title, value, min, max, step = 1, startPoint = 0, marks = {}, callback, onBeforeChange, onAfterChange } = props;
  return (
    <div className="toolbar__block">
      <div className="slider__header">
        <p className="slider__title">{title}</p>
        <span className="slider__input">{value}</span>
      </div>
      <RcSlider
        value={value}
        min={min}
        max={max}
        startPoint={startPoint}
        step={step}
        onChange={(val) => {
          if (typeof val === "number") {
            callback(val);
          }
        }}
        onBeforeChange={() => {
          onBeforeChange?.();
        }}
        onChangeComplete={() => {
          onAfterChange?.();
        }}
        marks={marks}
      />
    </div>
  );
};

export default Slider;
