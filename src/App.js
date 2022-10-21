import { useEffect, useRef} from 'react';
import './App.css';

export function App() {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      const c = document.getElementById('canvas');
      const canvas = ref.current.getContext('2d');
      const btn = document.getElementById('clearButton');
      btn.onclick = clear;
      let fromXY, toXY;

      const container = c.parentNode;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.id     = 'imageTemp';
      tempCanvas.width  = c.width;
      tempCanvas.height = c.height;
      container.appendChild(tempCanvas);
      const context = tempCanvas.getContext('2d');


      window.onload = function () {
        c.onclick = clickHandler;
        c.onmousemove = moveHandler;
        c.oncontextmenu = reset;
        reset();
      }

      function draw() { 
        canvas.beginPath();
        canvas.moveTo(fromXY.x, fromXY.y);
        canvas.lineTo(toXY.x, toXY.y);
        canvas.stroke();
        canvas.closePath();

      }

      function clear() {
        canvas.clearRect(0, 0, c.width, c.height);
        context.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
      }

      function reset() {
        fromXY = {};
        toXY = {};
      }

      function img_update () {
        context.drawImage(c, 0, 0);
        canvas.clearRect(0, 0, c.width, c.height);
      }

      function moveHandler(e) {
        if (typeof fromXY.x !== "undefined") {
          toXY.x = e.clientX;
          toXY.y = e.clientY;
          canvas.clearRect(!toXY.x , !toXY.y, c.width, c.height)
          draw();
        }
      }

      function clickHandler(e) {
        if (typeof fromXY.x === "undefined") {
          fromXY.x = e.clientX;
          fromXY.y = e.clientY;
        } else {
          reset();
          img_update();
        }
      }
    }
  }, [])

  return ( < >
    <canvas id = 'canvas' width = '500' heigth = '150'ref = {ref} onContextMenu={oncontextmenu}/>  
  </>)
}

export default App;
