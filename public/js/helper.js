// Helper functions like hashing, pooling image pixels, and random number seeding.

import { collection, getDocs, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Random number generator
export function mulberry32(a){
    return function(){
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Hash function, saved alongside the actual pixel values
// We can use it for quick comparison to see if values are different, then see the degree of difference in the pixels.
export async function sha256(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// Helper: convert RGBA array to Base64
export function arrayToBase64(rawArray) {
    const uint8 = new Uint8Array(rawArray);
    let binary = "";
    const chunk = 0x8000; // chunk to avoid stack overflow
    for (let i = 0; i < uint8.length; i += chunk) {
        const sub = uint8.subarray(i, i + chunk);
        binary += String.fromCharCode.apply(null, sub);
    }
    return btoa(binary);
}

// Helper: convert Base64 array to RGBA array
export function base64ToArray(base64) {
    const binary = atob(base64);
    const arr = new Uint8ClampedArray(binary.length);

    for (let i = 0; i < binary.length; i++) {
        arr[i] = binary.charCodeAt(i);
    }

    return arr;
}

// load all canvas 0 from the page
export async function loadCanvas0Dataset(db) {

    const devicesSnap = await getDocs(collection(db, "devices"));

    const dataset = [];

    for (const deviceDoc of devicesSnap.docs) {

        const deviceData = deviceDoc.data();

        const canvas0Snap = await getDoc(
            doc(db, "devices", deviceDoc.id, "canvases", "canvas_0")
        );

        if (!canvas0Snap.exists()) continue;

        const canvas0 = canvas0Snap.data();

        dataset.push({
            deviceId: deviceDoc.id,
            userAgent: deviceData.user_agent,
            pixels: base64ToArray(canvas0.pixels)
        });
    }

    return dataset;
}
function euclideanDistance(a, b) {
    let sum = 0;

    for (let i = 0; i < a.length; i++) {
        const d = a[i] - b[i];
        sum += d * d;
    }

    return Math.sqrt(sum);
}

export async function findClosestDevice(db, rawPixels) {

    const dataset = await loadCanvas0Dataset(db);

    const current = rawPixels.find(c => c.canvas_id === 0).pixels;

    let best = null;
    let bestScore = Infinity;

    for (const item of dataset) {

        const score = euclideanDistance(current, item.pixels);
        const similarity = Math.exp(-score);

        if (score < bestScore) {
            bestScore = score;
            best = item;
        }
    }

    return {
        deviceId: best.deviceId,
        userAgent: best.userAgent,
        score: bestScore,
        similarity: Math.exp(-bestScore) * 100
    };
}