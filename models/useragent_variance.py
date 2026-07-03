# This computes a global mean (how all user agents rendered) against a device-browser rendering for an image
# then repeats this for all 100 unique canvases we did
# we then average the 100 different maps per user agent to get a map of overall how each user agent differs from the

import numpy as np
from collections import defaultdict
from load_data import load_samples
import matplotlib.pyplot as plt

# load the data
samples = load_samples()

# only take samples from canvas 0
canvas_0_samples = [s for s in samples if s["canvas_id"] == 0]

# function to group user agents by device and browser engine
def simplify_ua(ua: str) -> str:

    ua_l = ua.lower()

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
    # IMPORTANT: Safari check must exclude Chrome/Chromium
    elif "safari" in ua_l and "chrome" not in ua_l:
        engine = "Safari(WebKit)"
    else:
        engine = "Other"

    # -------- OS --------
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

ua_images = defaultdict(list)

# now we have a dictionary of user agents and their rendering of canvas 0
for s in canvas_0_samples:
    ua = simplify_ua(s["user_agent"])
    # print(ua)
    img = s['image'][..., :3]

    ua_images[ua].append(img)

# get global mean of all user agents for canvas 0
all_imgs = np.stack([s["image"][..., :3] for s in canvas_0_samples])

global_mean = np.mean(all_imgs, axis=0)


# get heatmaps on where each user agent differs from the global mean
ua_heatmaps = {}

for ua, imgs in ua_images.items():
    imgs = np.stack(imgs)

    ua_mean = np.mean(imgs, axis=0)

    diff = np.abs(ua_mean - global_mean)

    heatmap = np.mean(diff, axis=2)  # collapse RGB

    ua_heatmaps[ua] = heatmap

print(f"Found {len(ua_heatmaps)} browser-device combos")

# render each user agent heatmap

for ua, heatmap in ua_heatmaps.items():
    plt.figure()
    plt.title(ua[:60])
    plt.imshow(heatmap, cmap="hot")
    plt.colorbar()
    plt.show()



