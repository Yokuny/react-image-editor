import { useRef } from "react";
import { hexToRgb } from "../../helpers/colorConverter";
import { useEffectsStore } from "../../hooks/useEffectsStore";
import { EffectCommand } from "../../command/effect";
import type { EffectValue } from "../../command/effect";
import { useAppStore } from "../../hooks/useAppStore";
import ColorPicker from "../ColorPicker";
import Slider from "../Slider";

// Helper to capture current effect state as EffectValue[]
const captureEffectValues = (): EffectValue[] => {
  const state = useAppStore.getState();
  return [
    { id: "brightness", value: state.brightness },
    { id: "contrast", value: state.contrast },
    { id: "saturation", value: state.saturation },
    { id: "hue", value: state.hue },
    { id: "pixelate", value: state.pixelate },
    { id: "noise", value: state.noise },
    { id: "invert", value: state.invert },
    { id: "blur", value: state.blur },
    { id: "tintOpacity", value: state.tintOpacity },
  ];
};

export const ToolbarEffects = () => {
  const {
    brightness,
    setBrightness,
    contrast,
    setContrast,
    saturation,
    setSaturation,
    hue,
    setHue,
    pixelate,
    setPixelate,
    noise,
    setNoise,
    invert,
    setInvert,
    blur,
    setBlur,
    tintOpacity,
    setTintOpacity,
    tintColor,
    setTintColor,
    resetEffects,
  } = useEffectsStore();

  // Track the state before a slider interaction begins
  const beforeValuesRef = useRef<EffectValue[] | null>(null);

  const handleSliderStart = () => {
    beforeValuesRef.current = captureEffectValues();
  };

  const createEffectCallback = (setter: (value: number) => void, _id: string, transform?: (v: number) => number) => {
    return (value: number) => {
      // Capture before state on first change if not already captured
      if (!beforeValuesRef.current) {
        beforeValuesRef.current = captureEffectValues();
      }
      const transformed = transform ? transform(value) : value;
      setter(transformed);
    };
  };

  const handleSliderAfterChange = (_id: string) => {
    return () => {
      if (beforeValuesRef.current) {
        const afterValues = captureEffectValues();
        const command = new EffectCommand(beforeValuesRef.current, afterValues);
        useAppStore.getState().history.push(command);
        beforeValuesRef.current = null;
      }
    };
  };

  const handleReset = () => {
    const previousValues = captureEffectValues();
    resetEffects();
    const afterValues = captureEffectValues();
    const command = new EffectCommand(previousValues, afterValues);
    useAppStore.getState().history.push(command);
  };

  return (
    <div className="toolbar__content">
      <Slider
        title="Brightness"
        value={Math.round(brightness * 250)}
        min={-100}
        max={100}
        callback={createEffectCallback(setBrightness, "brightness", (v) => v / 250)}
        onBeforeChange={handleSliderStart}
        onAfterChange={handleSliderAfterChange("brightness")}
      />
      <Slider
        title="Contrast"
        value={Math.round(contrast * 250)}
        min={-100}
        max={100}
        callback={createEffectCallback(setContrast, "contrast", (v) => v / 250)}
        onBeforeChange={handleSliderStart}
        onAfterChange={handleSliderAfterChange("contrast")}
      />
      <Slider
        title="Saturation"
        value={Math.round(saturation * 100)}
        min={-100}
        max={100}
        callback={createEffectCallback(setSaturation, "saturation", (v) => v / 100)}
        onBeforeChange={handleSliderStart}
        onAfterChange={handleSliderAfterChange("saturation")}
      />
      <Slider
        title="Hue Rotate"
        value={Math.round(hue * 100)}
        min={-100}
        max={100}
        callback={createEffectCallback(setHue, "hue", (v) => v / 100)}
        onBeforeChange={handleSliderStart}
        onAfterChange={handleSliderAfterChange("hue")}
      />
      <Slider
        title="Pixelate"
        value={pixelate}
        min={1}
        max={100}
        callback={createEffectCallback(setPixelate, "pixelate")}
        onBeforeChange={handleSliderStart}
        onAfterChange={handleSliderAfterChange("pixelate")}
      />
      <Slider
        title="Noise"
        value={noise}
        min={0}
        max={100}
        callback={createEffectCallback(setNoise, "noise")}
        onBeforeChange={handleSliderStart}
        onAfterChange={handleSliderAfterChange("noise")}
      />
      <Slider
        title="Invert"
        value={Math.round(invert * 100)}
        min={0}
        max={100}
        callback={createEffectCallback(setInvert, "invert", (v) => v / 100)}
        onBeforeChange={handleSliderStart}
        onAfterChange={handleSliderAfterChange("invert")}
      />
      <Slider
        title="Blur"
        value={Math.round(blur * 100)}
        min={0}
        max={100}
        callback={createEffectCallback(setBlur, "blur", (v) => v / 100)}
        onBeforeChange={handleSliderStart}
        onAfterChange={handleSliderAfterChange("blur")}
      />

      <Slider
        title="Tint"
        value={Math.round(tintOpacity * 100)}
        min={0}
        max={100}
        callback={createEffectCallback(setTintOpacity, "tintOpacity", (v) => v / 100)}
        onBeforeChange={handleSliderStart}
        onAfterChange={handleSliderAfterChange("tintOpacity")}
      />
      <ColorPicker
        currentColorCode={hexToRgb(tintColor)}
        callback={(hex) => {
          const previousValues = captureEffectValues();
          setTintColor(hex);
          setTintOpacity(1);
          const afterValues = captureEffectValues();
          const command = new EffectCommand(previousValues, afterValues);
          useAppStore.getState().history.push(command);
        }}
        output="hex"
      />
      <button type="button" className="toolbar__action-btn" onClick={handleReset}>
        Reset
      </button>
    </div>
  );
};

export default ToolbarEffects;
