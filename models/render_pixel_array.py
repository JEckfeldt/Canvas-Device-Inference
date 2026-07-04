# This file just generates a numerical representation of a canvas image for understanding what it stored like numerically.
import numpy as np
import matplotlib.pyplot as plt

H, W = 5, 5

img = np.zeros((H, W, 4), dtype=np.uint8)

# build RGBA values
for i in range(H):
    for j in range(W):
        img[i, j] = [
            (i * 40) % 256,
            (j * 50) % 256,
            (i * j * 30) % 256,
            255
        ]

fig, ax = plt.subplots(figsize=(8, 6))

ax.set_xlim(0, W)
ax.set_ylim(0, H)

# draw grid
ax.set_xticks(np.arange(W + 1))
ax.set_yticks(np.arange(H + 1))
ax.grid(True)

# hide axis labels
ax.set_xticklabels([])
ax.set_yticklabels([])
ax.invert_yaxis()

# place RGBA text in each cell
for i in range(H):
    for j in range(W):
        r, g, b, a = img[i, j]
        ax.text(
            j + 0.5,
            i + 0.5,
            f"({r},{g},{b},{a})",
            ha="center",
            va="center",
            fontsize=8
        )

ax.set_title("RGBA Pixel Matrix (Explicit Representation)")

plt.tight_layout()
plt.show()