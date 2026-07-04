from load_data import load_samples
import numpy as np
import matplotlib.pyplot as plt
import os

# ---------------- Load ----------------

samples = load_samples()
canvas_0 = [s for s in samples if s["canvas_id"] == 0]

imgs = np.stack([s["image"] for s in canvas_0])
stack = imgs[..., :3].astype(np.float32)

print("Shape:", stack.shape)

# ---------------- Per-pixel statistics ----------------

mean = np.mean(stack, axis=0)
min_val = np.min(stack, axis=0)
max_val = np.max(stack, axis=0)

range_rgb = max_val - min_val
range_score = np.mean(range_rgb, axis=-1)

flat = range_score.ravel()

# ---------------- Ensure output directory ----------------

out_dir = "../public/images"
os.makedirs(out_dir, exist_ok=True)

# ---------------- Visualization 1: HEATMAP ----------------

plt.figure(figsize=(6, 5))
plt.imshow(range_score, cmap="hot")
plt.colorbar(label="RGB Range (avg across channels)")
plt.title("Per-Pixel Rendering Variability (Range)")
plt.axis("off")

heatmap_path = os.path.join(out_dir, "canvas0_range_heatmap.png")
plt.savefig(heatmap_path, dpi=300, bbox_inches="tight")
plt.show()

print("Saved heatmap to:", heatmap_path)

# ---------------- Visualization 2: HISTOGRAM ----------------

plt.figure(figsize=(7, 4))
plt.hist(flat, bins=50, edgecolor="black")
plt.title("Distribution of Per-Pixel RGB Range")
plt.xlabel("Max - Min RGB Value (avg channels)")
plt.ylabel("Number of Pixels")

hist_path = os.path.join(out_dir, "canvas0_range_histogram.png")
plt.savefig(hist_path, dpi=300, bbox_inches="tight")
plt.show()

print("Saved histogram to:", hist_path)

# ---------------- Stats ----------------

print("\nStats:")
print("Mean range:", np.mean(flat))
print("Median range:", np.median(flat))
print("95th percentile:", np.percentile(flat, 95))
print("Max range:", np.max(flat))