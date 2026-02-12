import type Konva from "konva";
import KonvaModule from "konva";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Rect, Stage, Transformer } from "react-konva";
import { useCanvasStore } from "../hooks/useCanvasStore";
import { useCropperStore } from "../hooks/useCropperStore";
import { useEffectsStore } from "../hooks/useEffectsStore";
import { useImageStore } from "../hooks/useImageStore";
import { useUIStore } from "../hooks/useUIStore";

const Canvas = () => {
  const stageRef = useRef<Konva.Stage>(null);
  const imageRef = useRef<Konva.Image>(null);
  const cropRectRef = useRef<Konva.Rect>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  const { isToolbarOpen } = useUIStore();
  const { setKonvaStage, konvaStage, scale, angle, flipX, flipY, mode } = useCanvasStore();
  const { imageUrl, setImageInstance, setImageSize, imageWidth, imageHeight } = useImageStore();
  const { brightness, contrast, saturation, hue, blur, pixelate, noise, invert, tintColor, tintOpacity } = useEffectsStore();
  const { cropZoneWidth, cropZoneHeight, cropX, cropY, cropRatio, setCropZoneWidth, setCropZoneHeight, setCropX, setCropY } = useCropperStore();

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const isCropMode = mode === "crop" && image !== null;

  // Initialize Konva stage reference
  useEffect(() => {
    if (!stageRef.current || konvaStage) return;
    setKonvaStage(stageRef.current);
  }, [setKonvaStage, konvaStage]);

  // Load image when imageUrl changes
  useEffect(() => {
    if (!imageUrl) {
      setImage(null);
      return;
    }
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      setImage(img);
      setImageInstance(img);
      setImageSize(img.naturalWidth, img.naturalHeight);
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
    };
  }, [imageUrl, setImageInstance, setImageSize]);

  // Initialize crop zone when entering crop mode
  useEffect(() => {
    if (isCropMode && image) {
      const w = image.naturalWidth;
      const h = image.naturalHeight;
      if (cropRatio) {
        // Fit the ratio inside the image
        const ratioValue = cropRatio.width / cropRatio.height;
        let cropW = w;
        let cropH = w / ratioValue;
        if (cropH > h) {
          cropH = h;
          cropW = h * ratioValue;
        }
        setCropZoneWidth(Math.round(cropW));
        setCropZoneHeight(Math.round(cropH));
        setCropX(Math.round((w - cropW) / 2));
        setCropY(Math.round((h - cropH) / 2));
      } else if (cropZoneWidth === 0 || cropZoneHeight === 0) {
        // Default: full image
        setCropZoneWidth(w);
        setCropZoneHeight(h);
        setCropX(0);
        setCropY(0);
      }
    }
  }, [isCropMode, image, cropRatio, setCropZoneWidth, setCropZoneHeight, setCropX, setCropY, cropZoneWidth, cropZoneHeight]);

  // Attach Transformer to crop rect
  useEffect(() => {
    if (isCropMode && transformerRef.current && cropRectRef.current) {
      transformerRef.current.nodes([cropRectRef.current]);
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isCropMode]);

  // Build Konva filters
  const filters = useMemo(() => {
    const activeFilters: Array<typeof KonvaModule.Filters.Brighten> = [];
    if (brightness !== 0) activeFilters.push(KonvaModule.Filters.Brighten);
    if (contrast !== 0) activeFilters.push(KonvaModule.Filters.Contrast);
    if (saturation !== 0 || hue !== 0) activeFilters.push(KonvaModule.Filters.HSL);
    if (blur > 0) activeFilters.push(KonvaModule.Filters.Blur);
    if (pixelate > 1) activeFilters.push(KonvaModule.Filters.Pixelate);
    if (noise > 0) activeFilters.push(KonvaModule.Filters.Noise);
    if (invert > 0) activeFilters.push(KonvaModule.Filters.Invert);
    if (tintOpacity > 0) activeFilters.push(KonvaModule.Filters.RGBA);
    return activeFilters;
  }, [brightness, contrast, saturation, hue, blur, pixelate, noise, invert, tintOpacity]);

  // Apply filter values
  useEffect(() => {
    const node = imageRef.current;
    if (!node || !image) return;
    node.cache();
    node.filters(filters);
    node.brightness(brightness);
    node.contrast(contrast * 100);
    node.saturation(saturation);
    node.hue(hue * 360);
    node.blurRadius(blur * 20);
    node.pixelSize(pixelate);
    node.noise(noise / 100);
    if (tintOpacity > 0 && tintColor) {
      const r = Number.parseInt(tintColor.slice(1, 3), 16) || 0;
      const g = Number.parseInt(tintColor.slice(3, 5), 16) || 0;
      const b = Number.parseInt(tintColor.slice(5, 7), 16) || 0;
      node.red(r);
      node.green(g);
      node.blue(b);
      node.alpha(tintOpacity);
    }
    node.getLayer()?.batchDraw();
  }, [filters, brightness, contrast, saturation, hue, blur, pixelate, noise, tintColor, tintOpacity, image]);

  // Handle crop rect drag
  const handleCropDragMove = useCallback(
    (e: Konva.KonvaEventObject<DragEvent>) => {
      const node = e.target;
      const imgW = imageWidth || (image?.naturalWidth ?? 0);
      const imgH = imageHeight || (image?.naturalHeight ?? 0);

      // Clamp position within image bounds
      let x = Math.max(0, Math.min(node.x(), imgW - node.width() * node.scaleX()));
      let y = Math.max(0, Math.min(node.y(), imgH - node.height() * node.scaleY()));
      x = Math.round(x);
      y = Math.round(y);
      node.x(x);
      node.y(y);

      setCropX(x);
      setCropY(y);
    },
    [imageWidth, imageHeight, image, setCropX, setCropY],
  );

  // Handle crop rect transform (resize)
  const handleCropTransform = useCallback(
    (e: Konva.KonvaEventObject<Event>) => {
      const node = e.target as Konva.Rect;
      const imgW = imageWidth || (image?.naturalWidth ?? 0);
      const imgH = imageHeight || (image?.naturalHeight ?? 0);

      // Get the new dimensions from scale
      let newWidth = Math.round(node.width() * node.scaleX());
      let newHeight = Math.round(node.height() * node.scaleY());

      // Clamp to image bounds
      newWidth = Math.max(10, Math.min(newWidth, imgW));
      newHeight = Math.max(10, Math.min(newHeight, imgH));

      // If aspect ratio is locked, enforce it
      if (cropRatio) {
        const ratioValue = cropRatio.width / cropRatio.height;
        const currentRatio = newWidth / newHeight;
        if (currentRatio > ratioValue) {
          newWidth = Math.round(newHeight * ratioValue);
        } else {
          newHeight = Math.round(newWidth / ratioValue);
        }
      }

      // Clamp position
      const x = Math.max(0, Math.min(Math.round(node.x()), imgW - newWidth));
      const y = Math.max(0, Math.min(Math.round(node.y()), imgH - newHeight));

      // Reset scale and set size directly
      node.scaleX(1);
      node.scaleY(1);
      node.width(newWidth);
      node.height(newHeight);
      node.x(x);
      node.y(y);

      setCropZoneWidth(newWidth);
      setCropZoneHeight(newHeight);
      setCropX(x);
      setCropY(y);
    },
    [imageWidth, imageHeight, image, cropRatio, setCropZoneWidth, setCropZoneHeight, setCropX, setCropY],
  );

  const imgWidth = image ? image.naturalWidth : 0;
  const imgHeight = image ? image.naturalHeight : 0;

  // Stage dimensions
  const isRotated90 = Math.abs(angle % 180) === 90;
  const effectiveWidth = isRotated90 ? imgHeight : imgWidth;
  const effectiveHeight = isRotated90 ? imgWidth : imgHeight;
  const stageWidth = Math.max(effectiveWidth * scale, 1);
  const stageHeight = Math.max(effectiveHeight * scale, 1);

  // Image transform
  const centerX = stageWidth / 2;
  const centerY = stageHeight / 2;
  const scaleX = flipX ? -scale : scale;
  const scaleY = flipY ? -scale : scale;

  // Crop overlay dimensions (in image coordinates, rendered in a separate layer at scale 1 over the stage)
  const cropOverlayActive = isCropMode && cropZoneWidth > 0 && cropZoneHeight > 0;

  // For crop mode we render at scale=1 (no zoom/rotation applied) for simplicity
  const cropStageWidth = isCropMode ? imgWidth : stageWidth;
  const cropStageHeight = isCropMode ? imgHeight : stageHeight;

  return (
    <section className={`canvas custom-scrollbar ${isToolbarOpen ? "canvas_toolbar-open" : ""}`}>
      <Stage ref={stageRef} width={isCropMode ? cropStageWidth : stageWidth} height={isCropMode ? cropStageHeight : stageHeight} style={{ display: "inline-block" }}>
        {/* Image Layer */}
        <Layer>
          {image && (
            <KonvaImage
              ref={imageRef}
              image={image}
              x={isCropMode ? 0 : centerX}
              y={isCropMode ? 0 : centerY}
              width={imgWidth}
              height={imgHeight}
              offsetX={isCropMode ? 0 : imgWidth / 2}
              offsetY={isCropMode ? 0 : imgHeight / 2}
              scaleX={isCropMode ? 1 : scaleX}
              scaleY={isCropMode ? 1 : scaleY}
              rotation={isCropMode ? 0 : angle}
            />
          )}
        </Layer>

        {/* Crop Overlay Layer */}
        {cropOverlayActive && (
          <Layer>
            {/* Dark overlay — drawn using 4 rectangles around the crop zone */}
            {/* Top */}
            <Rect x={0} y={0} width={imgWidth} height={cropY} fill="rgba(0,0,0,0.5)" listening={false} />
            {/* Bottom */}
            <Rect x={0} y={cropY + cropZoneHeight} width={imgWidth} height={imgHeight - cropY - cropZoneHeight} fill="rgba(0,0,0,0.5)" listening={false} />
            {/* Left */}
            <Rect x={0} y={cropY} width={cropX} height={cropZoneHeight} fill="rgba(0,0,0,0.5)" listening={false} />
            {/* Right */}
            <Rect x={cropX + cropZoneWidth} y={cropY} width={imgWidth - cropX - cropZoneWidth} height={cropZoneHeight} fill="rgba(0,0,0,0.5)" listening={false} />

            {/* Crop zone — draggable & resizable */}
            <Rect
              ref={cropRectRef}
              x={cropX}
              y={cropY}
              width={cropZoneWidth}
              height={cropZoneHeight}
              fill="transparent"
              stroke="#ffffff"
              strokeWidth={2}
              dash={[6, 3]}
              draggable
              onDragMove={handleCropDragMove}
              onTransformEnd={handleCropTransform}
            />

            {/* Rule of thirds grid lines */}
            <Rect x={cropX + cropZoneWidth / 3} y={cropY} width={0.5} height={cropZoneHeight} fill="rgba(255,255,255,0.3)" listening={false} />
            <Rect x={cropX + (cropZoneWidth * 2) / 3} y={cropY} width={0.5} height={cropZoneHeight} fill="rgba(255,255,255,0.3)" listening={false} />
            <Rect x={cropX} y={cropY + cropZoneHeight / 3} width={cropZoneWidth} height={0.5} fill="rgba(255,255,255,0.3)" listening={false} />
            <Rect x={cropX} y={cropY + (cropZoneHeight * 2) / 3} width={cropZoneWidth} height={0.5} fill="rgba(255,255,255,0.3)" listening={false} />

            {/* Transformer for resizing */}
            <Transformer
              ref={transformerRef}
              rotateEnabled={false}
              keepRatio={cropRatio !== null}
              enabledAnchors={
                cropRatio !== null
                  ? ["top-left", "top-right", "bottom-left", "bottom-right"]
                  : ["top-left", "top-center", "top-right", "middle-left", "middle-right", "bottom-left", "bottom-center", "bottom-right"]
              }
              borderStroke="#ffffff"
              borderStrokeWidth={0}
              anchorStroke="#ffffff"
              anchorFill="#ffffff"
              anchorSize={10}
              anchorCornerRadius={2}
              boundBoxFunc={(oldBox, newBox) => {
                // Prevent too small
                if (newBox.width < 10 || newBox.height < 10) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          </Layer>
        )}
      </Stage>
    </section>
  );
};

export default Canvas;
