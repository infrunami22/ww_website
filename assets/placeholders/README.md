# Placeholder Images

This directory should contain placeholder/fallback images for the WW application.

## Required File

Create a file named `default.jpg` (or `default.webp`) in this folder to serve as the fallback image when nominee photos fail to load or are missing.

### Recommended Specs for default.jpg:
- **Dimensions**: 800x1000px (4:5 aspect ratio)
- **Format**: JPG or WebP
- **Size**: Under 200KB
- **Content**: A neutral, generic image (abstract pattern, logo, or simple graphic)

### Quick Setup:

You can create a simple solid color placeholder or download a free stock image.

**Option 1: Use a solid color**
Create a simple colored rectangle using any image editor or online tool.

**Option 2: Download a free placeholder**
Visit sites like:
- https://placeholder.com/
- https://unsplash.com/ (search for "abstract")
- https://www.pexels.com/ (search for "minimalist")

Save the image as `default.jpg` in this directory.

### Example using ImageMagick (if installed):
```bash
magick -size 800x1000 xc:#e9ecef -pointsize 72 -fill #6c757d -gravity center -annotate +0+0 "WW" default.jpg
```

### Without ImageMagick:
Simply create any 800x1000px image with your preferred tool and save it here.
