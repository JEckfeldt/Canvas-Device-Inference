
// Code for generating canvas images programatically
// They are generated in a way such that device hardware is allowed some freedom on the placement/coloring of pixels.
// This way we can observe the differences in images from the hardware differences in devices.

import { mulberry32 } from "./helper.js";

// Draw a canvas for fingerprinting
// Use as many techniques as possible to maximize device specific rendering
function drawFingerprintCanvas(canvasId) {

    // output canvas
    const canvas = document.createElement("canvas");
    canvas.width = 160;
    canvas.height = 100;
    const ctx = canvas.getContext("2d");

    const rand = mulberry32(canvasId);

    // --- 1. Color Gradient ---
    const grad = ctx.createLinearGradient(
        rand() * 160,
        rand() * 100,
        rand() * 160,
        rand() * 100
    );
    for (let i = 0; i < 10; i++) {
        grad.addColorStop(i / 9, `rgb(${rand() * 255},${rand() * 255},${rand() * 255})`);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 160, 100);

    // --- 2. Radial Gradient ---
    const rgrad = ctx.createRadialGradient(
        rand() * 160,
        rand() * 100,
        4,
        rand() * 160,
        rand() * 100,
        80
    );
    rgrad.addColorStop(0, "rgba(255,255,255,0.2)");
    rgrad.addColorStop(1, "rgba(0,0,0,0.2)");
    ctx.fillStyle = rgrad;
    ctx.fillRect(0, 0, 160, 100);

    // --- 3. Fractional Pixel Grid ---
    ctx.lineWidth = 0.5; // scaled down
    for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * 8 + rand());
        ctx.lineTo(160, i * 8 + rand());
        ctx.strokeStyle = `rgba(${rand()*255},${rand()*255},${rand()*255},0.4)`;
        ctx.stroke();
    }

    // --- 4. Rotated Fractional Text ---
    ctx.save();
    ctx.translate(80 + rand() * 12, 50 + rand() * 12);
    ctx.rotate(rand() * 0.6);
    ctx.font = `${12 + rand() * 4}px Arial`; // scaled font
    ctx.fillStyle = "rgba(0,0,0,0.8)";
    ctx.fillText("Cwm fjord bank glyphs vext quiz 12345", -68 + rand() * 10, rand() * 10);
    ctx.restore();

    // --- 5. Shadow Blur rectangle ---
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 4 + rand() * 8;
    ctx.fillStyle = `rgba(${rand()*255},${rand()*255},${rand()*255},0.7)`;
    ctx.fillRect(rand() * 140, rand() * 80, 15 + rand() * 15, 10 + rand() * 15);
    ctx.shadowBlur = 0;

    // --- 6. Bezier curves ---
    ctx.lineWidth = 0.7 + rand() * 1.0;
    for (let i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.moveTo(rand() * 160, rand() * 100);
        ctx.bezierCurveTo(rand() * 160, rand() * 100, rand() * 160, rand() * 100, rand() * 160, rand() * 100);
        ctx.strokeStyle = `rgba(${rand()*255},${rand()*255},${rand()*255},0.6)`;
        ctx.stroke();
    }

    // --- 7. Blending Circles ---
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(rand() * 160, rand() * 100, 10 + rand() * 30, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rand()*255},${rand()*255},${rand()*255},0.35)`;
        ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    // --- 8. Small image scaling ---
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 20;
    tempCanvas.height = 20;
    const tctx = tempCanvas.getContext("2d");
    tctx.fillStyle = "#ff0000";
    tctx.fillRect(0, 0, 20, 20);
    tctx.fillStyle = "#00ff00";
    tctx.fillRect(5, 5, 10, 10);
    ctx.drawImage(tempCanvas, rand() * 140, rand() * 80, 40 + rand() * 20, 40 + rand() * 20);

    // --- Get raw pixel data ---
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    return {
        canvas: canvas,
        pixels: Array.from(imgData.data)
    };
}

// Create 100 different canvases and save their data
export function generateCanvasSet() {
    const container = document.getElementById("canvasContainer");
    const results = [];

    for (let i = 0; i < 100; i++) {
        const result = drawFingerprintCanvas(i);
        results.push({
            canvas_id: i,
            width: result.canvas.width,   
            height: result.canvas.height,
            pixels: result.pixels
        });

        if (container) container.appendChild(result.canvas);
    }
    return results;
}


