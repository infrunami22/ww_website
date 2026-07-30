# Nominee Images

This directory contains all nominee photos for the WW application.

## Naming Convention

**Pattern**: `YYYY-wWW-contestant-nominee-slug-NN.webp`

### Examples:
```
2026-w31-adam-scarlett-johansson-01.webp
2026-w31-adam-scarlett-johansson-02.webp
2026-w31-adam-scarlett-johansson-03.webp
2026-w31-bence-margot-robbie-01.webp
2026-w31-bence-margot-robbie-02.webp
```

### Components:
- `YYYY`: Year (e.g., 2026)
- `wWW`: Week number with 'w' prefix (e.g., w31)
- `contestant`: Contestant name in lowercase (e.g., adam, bence)
- `nominee-slug`: Nominee name as a slug (e.g., scarlett-johansson)
- `NN`: Sequential number (01, 02, 03, etc.)
- `.webp`: File extension (WebP recommended, but JPG/PNG also work)

## Image Requirements

### Technical Specs:
- **Format**: WebP (preferred), JPG, or PNG
- **Minimum Dimensions**: 800x1000px
- **Aspect Ratio**: 4:5 (portrait) recommended
- **Max File Size**: 2MB per image
- **Color Space**: sRGB

### Quality Guidelines:
- High resolution and sharp focus
- Good lighting
- Professional or semi-professional quality
- Appropriate content (remember this is a public website)

## Image Optimization

Before uploading, optimize your images:

### Using Online Tools:
- **Squoosh**: https://squoosh.app/
- **TinyPNG**: https://tinypng.com/
- **Compressor.io**: https://compressor.io/

### Using Command Line:

**Convert to WebP (using cwebp):**
```bash
cwebp -q 85 input.jpg -o 2026-w31-adam-nominee-01.webp
```

**Batch conversion (PowerShell):**
```powershell
Get-ChildItem *.jpg | ForEach-Object {
    cwebp -q 85 $_.FullName -o ($_.BaseName + ".webp")
}
```

## Organization Tips

Keep images organized by year or week if you have many:

```
images/
├── 2026-w24-adam-ariana-grande-01.webp
├── 2026-w24-adam-ariana-grande-02.webp
├── 2026-w24-bence-taylor-swift-01.webp
├── 2026-w25-adam-hailee-steinfeld-01.webp
└── ...
```

Or use subdirectories (requires updating paths in JSON):

```
images/
├── 2026/
│   ├── w24/
│   │   ├── adam-ariana-grande-01.webp
│   │   └── bence-taylor-swift-01.webp
│   └── w25/
│       └── adam-hailee-steinfeld-01.webp
```

## Git Considerations

**If your repository gets large** (>100MB with images):
1. Consider using a separate image repository
2. Enable Git LFS for image files
3. Or host images on a CDN

See the main README.md for details on using a separate image repository.

## Initial Setup

To get started quickly, you can use placeholder images or stock photos for testing:

1. Download free stock photos from Unsplash or Pexels
2. Resize and optimize them
3. Rename according to the convention above
4. Place them here
5. Update your JSON files with the correct paths

## Adding Images Workflow

1. Choose and download images
2. Optimize and convert to WebP
3. Rename using the naming convention
4. Place in this directory
5. Update `data/current.json` with image paths:
   ```json
   "imageUrls": [
     "assets/images/2026-w31-adam-nominee-01.webp",
     "assets/images/2026-w31-adam-nominee-02.webp"
   ]
   ```
6. Commit and push to GitHub
7. GitHub Pages will automatically serve the images

---

**Note**: Make sure you have the rights to use any images you upload. Respect copyright and use only properly licensed photos.
