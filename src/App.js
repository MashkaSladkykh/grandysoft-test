import { useEffect, useRef} from 'react';
import './App.css';

import {
  checkIntersection,
  colinearPointWithinSegment
} from 'line-intersect';


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

      const coords = [];

      function store(x, y, array) {
        array.push(x, y);
      }

      const chunk = (array, size) =>
        array.reduce((acc, _, i) => {
        if (i % size === 0) acc.push(array.slice(i, i + size))
          return acc
        }, 
      [])

      function img_update () {
        context.drawImage(c, 0, 0);
        canvas.clearRect(0, 0, c.width, c.height);
        container.appendChild(tempCanvas);
      }

      function intersection () {
        const arr = chunk(coords, 4);
        
        if(arr.length < 2) return;
        else{ arr.forEach(i => {
          console.log('res:' + i)
          const res = checkIntersection(...i)
          if (res.type !== 'none') {
            context.beginPath();
            context.fillStyle = '#c82124';
            context.arc(res.point.x, res.point.y, 4, 0, 2 * Math.PI);
            context.fill();
            context.closePath();
          } 
        }) 
        }
      }
        

      function moveHandler(e) {
        if (typeof fromXY.x !== "undefined") {
          toXY.x = e.clientX;
          toXY.y = e.clientY;
          canvas.clearRect(!toXY.x , !toXY.y, c.width, c.height);
          draw();
        }
      }

      function clickHandler(e) {
        if (typeof fromXY.x === "undefined") {
          fromXY.x = e.clientX;
          fromXY.y = e.clientY;
          store(fromXY.x, fromXY.y, coords)
        } else {
          store(toXY.x, toXY.y, coords);
          reset();
          img_update(); 
          intersection();        
        }
      }
    }
  }, [])

  return ( 
    <canvas id = 'canvas' width = '500' heigth = '150' ref = {ref} onContextMenu={oncontextmenu}/>  
 )
}

export default App;
