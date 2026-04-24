// upload.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { generateCanvasSet } from "./canvas.js";
import { sha256, arrayToBase64} from "./helper.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA8MpZTy6s3E9VDYY9T5tl_TK_NW7I18YI",
  authDomain: "canvas-collector.firebaseapp.com",
  projectId: "canvas-collector",
  storageBucket: "canvas-collector.firebasestorage.app",
  messagingSenderId: "47377063712",
  appId: "1:47377063712:web:a5cbcc5db63379ff8e0145",
  measurementId: "G-Q99QXN7TPL"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const db = getFirestore();

// Button event listener
document.getElementById("collectBtn").addEventListener("click", async function () {

    const button = document.getElementById("collectBtn");
    button.disabled = true;
    button.innerText = "Collecting";

    try {
        // 1. Generate 100 raw canvases
        const rawPixels = generateCanvasSet();

        // 2. Format pixels (raw → Base64)
        const formattedResults = rawPixels.map(item => ({
            canvas_id: item.canvas_id,
            width: item.width,
            height: item.height,
            pixels: arrayToBase64(item.pixels)
        }));
        
        console.log(formattedResults[0])
        console.log("Done processing pixels");

        // 3. Collect basic device info
        const userAgent = navigator.userAgent;
        const deviceInfo = {
            user_agent: userAgent,
            screen_width: window.screen.width,
            screen_height: window.screen.height,
            device_pixel_ratio: window.devicePixelRatio,
            language: navigator.language
        };

        // 4. Compute hash of first pixels for a UID
        const fingerprintHash = await sha256(
            formattedResults.slice(0, 5).map(item => item.pixels).join("")
        );
        console.log("Device UID: ", fingerprintHash)

        // 5. Reference to Firestore document
        const deviceRef = doc(db, "devices", fingerprintHash);

        // 6. Check if device already exists
        const existing = await getDoc(deviceRef);
        if (existing.exists()) {
            console.log("Device already recorded — skipping");
            button.innerText = "Data Submitted, Thank you.";
            button.disabled = true;
            return;
        }

        // 7. Store device info + timestamp
        await setDoc(deviceRef, {
            ...deviceInfo,
            timestamp: new Date().toISOString()
        });

        // 8. Upload all canvases under the device document
        const uploads = formattedResults.map(item => {
            return setDoc(
                doc(db, "devices", fingerprintHash, "canvases", `canvas_${item.canvas_id}`),
                item
            );
        });

        await Promise.all(uploads);
        console.log("Uploaded all canvases");

        button.innerText = "Data Submitted, Thank you!";
        button.disabled = true;

    } catch (error) {
        console.error("Upload failed:", error);
        button.innerText = "Data Submitted, Thank you.";
        button.disabled = true;
    }
});