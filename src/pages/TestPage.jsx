// import React, { useEffect, useRef, useState } from "react";

// const TestPage = () => {
//   const canvasRef = useRef(null);
//   const typingRef = useRef(null);

//   const [typingText, setTypingText] = useState("");
//   const [countdown, setCountdown] = useState("");

//   const text = "🎉 Happy New Year 🎉";
//   const targetYear = new Date().getFullYear() + 1;

//   /* -------------------- Canvas Fireworks -------------------- */
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext("2d");

//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };

//     resizeCanvas();
//     window.addEventListener("resize", resizeCanvas);

//     const random = (min, max) => Math.random() * (max - min) + min;

//     class Particle {
//       constructor(x, y, color) {
//         this.x = x;
//         this.y = y;
//         this.vx = random(-5, 5);
//         this.vy = random(-5, 5);
//         this.life = 100;
//         this.color = color;
//       }

//       update() {
//         this.vy += 0.05;
//         this.x += this.vx;
//         this.y += this.vy;
//         this.life--;
//       }

//       draw() {
//         ctx.beginPath();
//         ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
//         ctx.fillStyle = this.color;
//         ctx.fill();
//       }
//     }

//     let particles = [];

//     const explode = (x, y) => {
//       const color = `hsl(${random(0, 360)}, 100%, 50%)`;
//       for (let i = 0; i < 80; i++) {
//         particles.push(new Particle(x, y, color));
//       }
//     };

//     const loop = () => {
//       ctx.fillStyle = "rgba(0,0,0,0.25)";
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       if (Math.random() < 0.05) {
//         explode(
//           random(100, canvas.width - 100),
//           random(100, canvas.height / 2)
//         );
//       }

//       particles.forEach((p, i) => {
//         p.update();
//         p.draw();
//         if (p.life <= 0) particles.splice(i, 1);
//       });

//       requestAnimationFrame(loop);
//     };

//     loop();

//     return () => {
//       window.removeEventListener("resize", resizeCanvas);
//     };
//   }, []);

//   /* -------------------- Typing Effect -------------------- */
//   useEffect(() => {
//     let index = 0;
//     const interval = setInterval(() => {
//       setTypingText((prev) => prev + text.charAt(index));
//       index++;
//       if (index >= text.length) clearInterval(interval);
//     }, 120);

//     return () => clearInterval(interval);
//   }, []);

//   /* -------------------- Countdown -------------------- */
//   useEffect(() => {
//     const newYearTime = new Date(
//       `January 1, ${targetYear} 00:00:00`
//     ).getTime();

//     const timer = setInterval(() => {
//       const now = Date.now();
//       const diff = newYearTime - now;

//       if (diff <= 0) {
//         setCountdown("🎆 Welcome to the New Year! 🎆");
//         return;
//       }

//       const h = Math.floor(diff / (1000 * 60 * 60));
//       const m = Math.floor((diff / (1000 * 60)) % 60);
//       const s = Math.floor((diff / 1000) % 60);

//       setCountdown(`${h}h ${m}m ${s}s remaining`);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [targetYear]);

//   return (
//     <>
//     <style>
//         {`
//         body {
//   margin: 0;
//   overflow: hidden;
//   background: black;
//   font-family: Arial, sans-serif;
// }

// canvas {
//   position: absolute;
//   top: 0;
//   left: 0;
// }

// .content {
//   position: absolute;
//   top: 50%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   text-align: center;
//   z-index: 10;
//   color: white;
// }

// #typing {
//   font-size: 3.5rem;
//   text-shadow: 0 0 20px gold;
//   min-height: 60px;
// }

// #year {
//   font-size: 5rem;
//   color: gold;
//   text-shadow: 0 0 40px gold;
//   margin-top: 10px;
// }

// #countdown {
//   font-size: 1.8rem;
//   margin-top: 15px;
//   color: #ffdd55;
// }
// `}
//     </style>
//       <canvas ref={canvasRef} />

//       <div className="content">
//         <div id="typing">{typingText}</div>
//         <div id="year">{targetYear}</div>
//         <div id="countdown">{countdown}</div>
//       </div>
//     </>
//   );
// };

// export default TestPage

import React from 'react'

const TestPage = () => {
  return (
    <div>TestPage</div>
  )
}

export default TestPage