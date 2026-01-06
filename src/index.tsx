import { render } from "preact";
import { useEffect, useState, useCallback } from "preact/hooks";
import "./style.css";

export function App() {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const cellSize = 50;
  const columns = Math.floor(screenSize.width / cellSize);
  const rows = Math.floor(screenSize.height / cellSize);

  const calculateAngle = useCallback(
    (cellIndex) => {
      const col = cellIndex % columns;
      const row = Math.floor(cellIndex / columns);

      const cellCenterX = (col + 0.5) * cellSize;
      const cellCenterY = (row + 0.5) * cellSize;

      const deltaX = mousePosition.x - cellCenterX;
      const deltaY = mousePosition.y - cellCenterY;

      const angleRad = Math.atan2(deltaY, deltaX);
      const angleDeg = angleRad * (180 / Math.PI) - 90;

      return angleDeg;
    },
    [mousePosition, columns, cellSize]
  );

  const cells = Array.from({ length: columns * rows }, (_, i) => i);

  return (
    <div className="app">
      <div className="propaganda-overlay">
        <h1 className="propaganda-slogan">
          You will be watched and you will be happy
        </h1>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
        }}
      >
        {cells.map((index) => (
          <div
            key={index}
            className="grid-cell"
            style={{
              transform: `rotate(${calculateAngle(index)}deg)`,
            }}
          >
            ↓
          </div>
        ))}
      </div>
    </div>
  );
}

render(<App />, document.getElementById("app"));
