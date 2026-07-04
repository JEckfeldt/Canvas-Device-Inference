import numpy as np
from collections import defaultdict, Counter
from load_data import load_samples
import matplotlib.pyplot as plt

# Load data

samples = load_samples()

canvas_0_samples = [s for s in samples if s["canvas_id"] == 0]


# UA → Engine + OS grouping

def simplify_ua(ua: str) -> str:
    ua_l = ua.lower()

    # Engine
    if "firefox" in ua_l:
        engine = "Firefox(Gecko)"

    elif "edg" in ua_l:
        engine = "Edge(Chromium)"

    elif "opr" in ua_l:
        engine = "Opera(Chromium)"

    elif "steam" in ua_l:
        engine = "Steam(Chromium)"

    elif "chrome" in ua_l:
        engine = "Chrome(Chromium)"

    # IMPORTANT: robust Safari check
    elif (
        "safari" in ua_l
        and "chrome" not in ua_l
        and "edg" not in ua_l
        and "opr" not in ua_l
    ):
        engine = "Safari(WebKit)"

    else:
        engine = "Other(Unknown)"

    # OS
    if "windows" in ua_l:
        os = "Windows"
    elif "android" in ua_l:
        os = "Android"
    elif "iphone" in ua_l or "ios" in ua_l:
        os = "iOS"
    elif "mac" in ua_l or "macintosh" in ua_l:
        os = "Mac"
    elif "linux" in ua_l:
        os = "Linux"
    else:
        os = "Other"

    return f"{engine}-{os}"


# Sanity check distribution
group_counts = Counter(
    simplify_ua(s["user_agent"]) for s in canvas_0_samples
)

print("\nEngine-OS distribution (Canvas 0):\n")
for k, v in group_counts.most_common():
    print(f"{k:25s} {v}")



# Group images by Engine-OS
ua_images = defaultdict(list)

# save the first image as a reference for comparison
img = canvas_0_samples[0]["image"]

plt.figure(figsize=(6, 4))
plt.imshow(img)
plt.axis("off")
plt.title("Original Canvas Image")
plt.savefig("../public/images/original_canvas.png",
            dpi=300,
            bbox_inches="tight")
plt.close()

for s in canvas_0_samples:
    ua = simplify_ua(s["user_agent"])
    img = s["image"][..., :3]  # drop alpha
    ua_images[ua].append(img)



# Global mean (Canvas 0 only)
all_imgs = np.stack([s["image"][..., :3] for s in canvas_0_samples])
global_mean = np.mean(all_imgs, axis=0)



# Compute heatmaps
ua_heatmaps = {}

for ua, imgs in ua_images.items():
    imgs = np.stack(imgs)

    ua_mean = np.mean(imgs, axis=0)

    diff = np.abs(ua_mean - global_mean)

    heatmap = np.mean(diff, axis=2)  # RGB → intensity

    # Normalize for comparability
    heatmap = heatmap / (heatmap.max() + 1e-8)

    ua_heatmaps[ua] = heatmap


print(f"\nFound {len(ua_heatmaps)} engine-OS groups")



# Plot heatmaps
for ua, heatmap in ua_heatmaps.items():
    fig, ax = plt.subplots(figsize=(6, 4))

    im = ax.imshow(heatmap, cmap="hot")

    ax.set_title(ua)
    ax.axis("off")

    # colorbar styled like your second snippet
    cbar = plt.colorbar(im, ax=ax, label="Variance")

    plt.tight_layout()

    plt.savefig(
        f"../public/images/{ua.replace('-', '_')}.png",
        dpi=300,
        bbox_inches="tight"
    )

    plt.close(fig)