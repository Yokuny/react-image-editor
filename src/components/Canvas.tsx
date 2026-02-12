import { useRef, useEffect } from "react";
import { useUIStore } from "../hooks/useUIStore";
import { useCanvasStore } from "../hooks/useCanvasStore";
import { fabric } from "fabric";

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
