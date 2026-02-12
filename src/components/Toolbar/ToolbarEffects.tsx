import { hexToRgb } from "../../helpers/colorConverter";
import { useEffectsStore } from "../../hooks/useEffectsStore";
import ColorPicker from "../ColorPicker";
import Slider from "../Slider";

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

  return (
    <div className="toolbar__content">
      <Slider title="Brightness" value={Math.round(brightness * 250)} min={-100} max={100} callback={(value) => setBrightness(value / 250)} />
      <Slider title="Contrast" value={Math.round(contrast * 250)} min={-100} max={100} callback={(value) => setContrast(value / 250)} />
      <Slider title="Saturation" value={Math.round(saturation * 100)} min={-100} max={100} callback={(value) => setSaturation(value / 100)} />
      <Slider title="Hue Rotate" value={Math.round(hue * 100)} min={-100} max={100} callback={(value) => setHue(value / 100)} />
      <Slider title="Pixelate" value={pixelate} min={1} max={100} callback={(value) => setPixelate(value)} />
      <Slider title="Noise" value={noise} min={0} max={100} callback={(value) => setNoise(value)} />
      <Slider title="Invert" value={Math.round(invert * 100)} min={0} max={100} callback={(value) => setInvert(value / 100)} />
      <Slider title="Blur" value={Math.round(blur * 100)} min={0} max={100} callback={(value) => setBlur(value / 100)} />

      <Slider title="Tint" value={Math.round(tintOpacity * 100)} min={0} max={100} callback={(value) => setTintOpacity(value / 100)} />
      <ColorPicker
        currentColorCode={hexToRgb(tintColor)}
        callback={(hex) => {
          setTintColor(hex);
          setTintOpacity(1);
        }}
        output="hex"
      />
      <button className="toolbar__action-btn" onClick={resetEffects}>
        Reset
      </button>
    </div>
  );
};

export default ToolbarEffects;
