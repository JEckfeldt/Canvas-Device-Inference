# This file is for finding the zones in canvas images where user agents differ by either color values or positional values.

import numpy as np
import matplotlib.pyplot as plt
from load_data import load_samples

samples = load_samples()

canvas_0_samples = [s for s in samples if s["canvas_id"] == 0]

print(f"Found {len(canvas_0_samples)} samples")

imgs = np.stack([s["image"] for s in canvas_0_samples])

print(f"Image shape: {imgs.shape}")

# Keep only RGB and convert to float (alpha is constant)
stack = imgs[..., :3].astype(np.float32)

# Compute variance for each RGB channel
raw_var = np.var(stack, axis=0)

# Average the R, G, and B variances into a single value per pixel
raw_var = np.mean(raw_var, axis=2)

# Plot the raw variance heatmap
plt.figure(figsize=(6, 4))
plt.imshow(raw_var, cmap="hot")
plt.title("Raw Pixel Variance Across User Agents")
plt.colorbar(label="Variance")
plt.axis("off")
plt.tight_layout()
plt.show()