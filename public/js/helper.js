// Helper functions like hashing, pooling image pixels, and random number seeding.

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
