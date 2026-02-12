import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import { useCanvasStore } from "../hooks/useCanvasStore";
import { useUIStore } from "../hooks/useUIStore";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { isToolbarOpen } = useUIStore();
  const { setFabricCanvas, fabricCanvas } = useCanvasStore();

  useEffect(() => {
    if (!canvasRef.current || fabricCanvas) {
      return;
    }

    const canvas = new fabric.Canvas(canvasRef.current);
    setFabricCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [setFabricCanvas, fabricCanvas]);

  return (
    <section className={`canvas custom-scrollbar ${isToolbarOpen ? "canvas_toolbar-open" : ""}`}>
      <canvas ref={canvasRef} />
    </section>
  );
};

export default Canvas;
