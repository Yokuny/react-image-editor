import type Konva from "konva";
import KonvaModule from "konva";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Group, Image as KonvaImage, Layer, Rect, Stage, Transformer } from "react-konva";
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
  const { setKonvaStage, konvaStage, scale, angle, flipX, flipY, mode, setScale } = useCanvasStore();
  const { imageUrl, setImageInstance, setImageSize, imageWidth, imageHeight } = useImageStore();
  const { brightness, contrast, saturation, hue, blur, pixelate, noise, invert, tintColor, tintOpacity } = useEffectsStore();
  const { cropZoneWidth, cropZoneHeight, cropX, cropY, cropRatio, setCropZoneWidth, setCropZoneHeight, setCropX, setCropY } = useCropperStore();

  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const isCropMode = mode === "crop" && image !== null;

  const containerRef = useRef<HTMLElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    const updateSize = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    updateSize();

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!stageRef.current || konvaStage) return;
    setKonvaStage(stageRef.current);
  }, [setKonvaStage, konvaStage]);

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

      if (containerDimensions.width > 0 && containerDimensions.height > 0) {
        const padding = 40;
        const availableW = containerDimensions.width - padding;
        const availableH = containerDimensions.height - padding;
        const fitScale = Math.min(availableW / img.naturalWidth, availableH / img.naturalHeight);
        setScale(Math.min(fitScale, 1));
      }
    };
    img.onerror = () => {};
  }, [imageUrl, setImageInstance, setImageSize, containerDimensions, setScale]);

  const imgWidth = image ? image.naturalWidth : 0;
  const imgHeight = image ? image.naturalHeight : 0;

  const cropFitScale = useMemo(() => {
    if (!containerDimensions.width || !containerDimensions.height || !imgWidth || !imgHeight) return 1;
    const padding = 60;
    return Math.min((containerDimensions.width - padding) / imgWidth, (containerDimensions.height - padding) / imgHeight, 1);
  }, [containerDimensions, imgWidth, imgHeight]);

  const activeScale = isCropMode ? cropFitScale : scale;

  const isRotated90 = Math.abs(angle % 180) === 90;
  const effectiveWidth = isRotated90 ? imgHeight : imgWidth;
  const effectiveHeight = isRotated90 ? imgWidth : imgHeight;

  const stageWidth = Math.max(effectiveWidth * activeScale, containerDimensions.width);
  const stageHeight = Math.max(effectiveHeight * activeScale, containerDimensions.height);

  const centerX = stageWidth / 2;
  const centerY = stageHeight / 2;
  const scaleX = flipX ? -activeScale : activeScale;
  const scaleY = flipY ? -activeScale : activeScale;

  const cropOverlayActive = isCropMode && cropZoneWidth > 0 && cropZoneHeight > 0;

  useEffect(() => {
    if (isCropMode && image) {
      const w = image.naturalWidth;
      const h = image.naturalHeight;

      const ratioValue = cropRatio ? cropRatio.width / cropRatio.height : null;

      if (cropRatio && ratioValue) {
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
        setCropZoneWidth(w);
        setCropZoneHeight(h);
        setCropX(0);
        setCropY(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCropMode, image, cropRatio, setCropZoneWidth, setCropZoneHeight, setCropX, setCropY]);

  // Attach Transformer to crop rect
  useEffect(() => {
    if (isCropMode && transformerRef.current && cropRectRef.current) {
      transformerRef.current.nodes([cropRectRef.current]);
      transformerRef.current.anchorSize(Math.max(10, 10 / activeScale));
      transformerRef.current.getLayer()?.batchDraw();
    }
  }, [isCropMode, cropOverlayActive, cropZoneWidth, cropZoneHeight, activeScale]);

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

      let newWidth = Math.round(node.width() * node.scaleX());
      let newHeight = Math.round(node.height() * node.scaleY());

      newWidth = Math.max(10, Math.min(newWidth, imgW));
      newHeight = Math.max(10, Math.min(newHeight, imgH));

      if (cropRatio) {
        const ratioValue = cropRatio.width / cropRatio.height;
        const currentRatio = newWidth / newHeight;
        if (currentRatio > ratioValue) {
          newWidth = Math.round(newHeight * ratioValue);
        } else {
          newHeight = Math.round(newWidth / ratioValue);
        }
      }

      const x = Math.max(0, Math.min(Math.round(node.x()), imgW - newWidth));
      const y = Math.max(0, Math.min(Math.round(node.y()), imgH - newHeight));

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

  return (
    <section ref={containerRef} className={`canvas custom-scrollbar ${isToolbarOpen ? "canvas_toolbar-open" : ""}`}>
      <Stage ref={stageRef} width={stageWidth} height={stageHeight} style={{ display: "inline-block" }}>
        <Layer>
          {image && (
            <KonvaImage
              ref={imageRef}
              image={image}
              x={centerX}
              y={centerY}
              width={imgWidth}
              height={imgHeight}
              offsetX={imgWidth / 2}
              offsetY={imgHeight / 2}
              scaleX={isCropMode ? activeScale : scaleX}
              scaleY={isCropMode ? activeScale : scaleY}
              rotation={isCropMode ? 0 : angle}
            />
          )}
        </Layer>

        {cropOverlayActive && (
          <Layer>
            <Group x={centerX - (imgWidth * activeScale) / 2} y={centerY - (imgHeight * activeScale) / 2} scaleX={activeScale} scaleY={activeScale}>
              <Rect x={0} y={0} width={imgWidth} height={cropY} fill="rgba(0,0,0,0.5)" listening={false} />
              <Rect x={0} y={cropY + cropZoneHeight} width={imgWidth} height={imgHeight - cropY - cropZoneHeight} fill="rgba(0,0,0,0.5)" listening={false} />
              <Rect x={0} y={cropY} width={cropX} height={cropZoneHeight} fill="rgba(0,0,0,0.5)" listening={false} />
              <Rect x={cropX + cropZoneWidth} y={cropY} width={imgWidth - cropX - cropZoneWidth} height={cropZoneHeight} fill="rgba(0,0,0,0.5)" listening={false} />

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

              <Rect x={cropX + cropZoneWidth / 3} y={cropY} width={0.5} height={cropZoneHeight} fill="rgba(255,255,255,0.3)" listening={false} />
              <Rect x={cropX + (cropZoneWidth * 2) / 3} y={cropY} width={0.5} height={cropZoneHeight} fill="rgba(255,255,255,0.3)" listening={false} />
              <Rect x={cropX} y={cropY + cropZoneHeight / 3} width={cropZoneWidth} height={0.5} fill="rgba(255,255,255,0.3)" listening={false} />
              <Rect x={cropX} y={cropY + (cropZoneHeight * 2) / 3} width={cropZoneWidth} height={0.5} fill="rgba(255,255,255,0.3)" listening={false} />

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
                  if (newBox.width < 10 || newBox.height < 10) {
                    return oldBox;
                  }
                  return newBox;
                }}
              />
            </Group>
          </Layer>
        )}
      </Stage>
    </section>
  );
};

export default Canvas;
