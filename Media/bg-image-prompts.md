# Background Image Prompts

Send these prompts to Gemini (or any image generator) to create background images for the portfolio.

---

## 1. Hero Background — `media/hero-bg.jpg`

**Usage:** Full-screen background behind the hero section.  
**Recommended size:** 1920×1080px (or 2560×1440px for retina)

**Prompt:**
```
Cinematic 3D sci-fi landscape, deep matte black background (#050505), 
neon green glowing grid floor receding into the horizon in perspective, 
subtle volumetric green fog at the horizon, abstract glowing green 
circuit board traces and data streams flowing upward, Nvidia brand 
color palette (neon green #76b900 and bright green #00ff41 on pure black), 
photorealistic render, 8K ultra-detailed, no text, no logos, 
wide aspect ratio 16:9, dark edges vignette, 
cyberpunk aesthetic, professional portfolio background
```

---

## 2. About Section Background — `media/about-bg.jpg`

**Usage:** Subtle background texture for the About section.  
**Recommended size:** 1920×1080px

**Prompt:**
```
Abstract 3D sci-fi dark background, pure black base with faint neon green 
hexagonal grid pattern, glowing green particles floating in depth, 
depth-of-field blur on background elements, isometric circuit traces 
in dark green, extremely subtle and minimal so text remains readable, 
Nvidia green color accent (#76b900), 4K render, no text, 
widescreen 16:9 format
```

---

## 3. Skills Section Background — `media/skills-bg.jpg`

**Usage:** Background for the HUD panel skills grid section.  
**Recommended size:** 1920×1080px

**Prompt:**
```
Dark sci-fi 3D HUD environment, pure matte black background, 
glowing green holographic data panels floating in 3D space, 
neon green (#00ff41) scan lines and grid overlays, 
futuristic heads-up display elements, green data streams and binary 
code fragments, perspective depth with bokeh blur, 
Nvidia-style neon green and black color scheme, 
ultra high detail, 16:9, no text, no logos, 
cinematic dark atmosphere
```

---

## 4. Projects Section Background — `media/projects-bg.jpg`

**Usage:** Background for the portfolio/projects section.  
**Recommended size:** 1920×1080px

**Prompt:**
```
3D dark sci-fi space, deep black void with floating green luminous 
geometric shapes — cubes, spheres, polyhedrons with neon green (#76b900) 
wireframe edges, glowing green energy particles scattered in the scene, 
dramatic rim lighting in neon green, photorealistic 3D render, 
cinematic perspective, Nvidia color palette, 8K, 16:9, no text
```

---

## How to use

After generating:
1. Save each image to the `media/` folder with the filename shown above.
2. Reference them in CSS or inline style, e.g.:
   ```css
   .hero { background-image: url('media/hero-bg.jpg'); background-size: cover; }
   ```
