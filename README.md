# WW - Women Crush Wednesday

A production-grade static web application for hosting weekly "Women Crush Wednesday" reveals where two contestants nominate their crush choices each week. Built with vanilla HTML, CSS, and JavaScript for deployment on GitHub Pages.

## 🌟 Features

- **Automatic Wednesday Reveals**: Nominees are automatically revealed every Wednesday at 09:00 Europe/Budapest time
- **Independent Contestant Entries**: Each contestant can manage their own nominee separately
- **Editing Deadline**: Contestants can edit until Wednesday 08:59 (1 minute before reveal)
- **External Image Support**: Use image hosting services (Imgur, etc.) - no need to upload to GitHub
- **Countdown Timer**: Live countdown showing time remaining until reveal
- **Archive System**: Complete historical archive of past weeks with filtering and search
- **Admin Helper Panel**: Client-side tools for generating weekly JSON data
- **Legacy Import**: Parser for converting old text-format data into JSON
- **Responsive Design**: Mobile-first layout that works beautifully on all devices
- **Dark Mode**: Built-in theme toggle for light and dark modes
- **Image Gallery**: Lightbox viewer for nominee photos
- **No Backend Required**: Fully static, works perfectly with GitHub Pages

## 🚀 Quick Start Guide for Contestants

**Weekly workflow for each contestant:**

1. **Go to the website** (your deployed GitHub Pages URL)
2. **Click the gear icon** (⚙️) in the top-right corner
3. **Open your tab**: "Contestant A Entry" or "Contestant B Entry"
4. **Click "Load My Current Data"** to see your previous nominee (if this week already started)
5. **Fill in the form:**
   - Woman's name
   - Short description (one line)
   - Longer description (a paragraph)
   - Tags (comma-separated)
   - **Image URLs**: Paste direct links from Imgur, Imgbb, or any image host
6. **Click "Generate My JSON"**
7. **Copy the JSON** to clipboard
8. **Go to GitHub** → Your repository → `data/current.json`
9. **Edit the file** → Replace your nominee section (`nomineeA` or `nomineeB`)
10. **Commit changes**
11. **Done!** Your nominee is live

**Deadline:** You can edit until **Wednesday 08:59 Budapest time**. After that, it's locked until reveal at 09:00.

## 📁 Project Structure

```
ww_website/
├── ww.html                          # Main HTML file
├── assets/
│   ├── styles.css                   # Complete stylesheet with theme support
│   ├── app.js                       # JavaScript application logic
│   ├── images/                      # Nominee photos (see naming convention below)
│   └── placeholders/                # Fallback images
├── data/
│   ├── current.json                 # Current week data
│   ├── archive.json                 # Historical week entries
│   └── legacy-import-example.txt    # Example format for legacy data import
└── README.md                        # This file
```

## 🚀 Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/ww_website.git
cd ww_website
```

### 2. Deploy to GitHub Pages

1. Push your repository to GitHub
2. Go to repository Settings → Pages
3. Select branch (usually `main` or `master`)
4. Select root directory (`/`)
5. Click Save
6. Your site will be available at `https://yourusername.github.io/ww_website/ww.html`

### 3. (Optional) Add Local Placeholder Image

If you want a custom fallback image for broken links:

```bash
# Create or download a default placeholder image and save it as:
# assets/placeholders/default.jpg
```

This is optional - the app will handle missing images gracefully.

## 📅 Managing Weekly Nominations

### Two Workflows Available

#### Workflow 1: Individual Contestant Entry (Recommended)

This workflow allows each contestant to independently manage their nominee until the Wednesday 08:59 deadline.

**For Contestant A:**

1. Open your deployed site
2. Click the gear icon (⚙️) to open the Admin Panel
3. Go to the "Contestant A Entry" tab
4. Click "Load My Current Data" to see your existing nominee (if any)
5. Fill in or update your nominee details:
   - Woman's name
   - Short and long descriptions
   - Tags
   - **Image URLs** (paste direct links from image hosting services)
6. Click "Generate My JSON"
7. Copy the generated JSON
8. Open `data/current.json` in GitHub
9. Replace only the `nomineeA` section with your new JSON
10. Commit and push

**For Contestant B:**

Follow the same steps using the "Contestant B Entry" tab and replace the `nomineeB` section.

**Important Rules:**
- ✅ You can edit your nominee anytime before the deadline
- ✅ Each contestant updates only their own nominee section
- ⏰ **Deadline: Wednesday 08:59 Budapest time** (1 minute before reveal)
- ⚠️ After the deadline, the form will be disabled for that week
- 🔒 Once revealed (09:00), the week moves to archive and you start fresh

#### Workflow 2: Full Week Setup (Admin/Coordinator)

Use the "Week Setup" tab to create both nominees in one go. This is useful for:
- Initial week setup
- Managing the full week structure
- Coordinators who handle both entries

### Option 1: Using the Admin Panel (Recommended)

1. Open your deployed site
2. Click the gear icon (⚙️) in the header to show the Admin Panel
3. Fill in the "Weekly Entry" form:
   - Week ID (e.g., `31`)
   - Season/Year (e.g., `2026`)
   - Reveal Date and Time (Wednesday at 09:00)
   - Contestant names
   - Nominee details (names, descriptions, tags)
4. Upload images to your repository (see Image Management below)
5. Enter image paths in the form
6. Click "Generate JSON"
7. Copy the generated JSON
8. Replace the contents of `data/current.json` with the new JSON
9. Commit and push to GitHub

### Option 2: Manual JSON Editing

Edit `data/current.json` directly:

```json
{
  "site": {
    "title": "WW",
    "subtitle": "Women Crush Wednesday",
    "timezone": "Europe/Budapest",
    "imageBaseUrl": ""
  },
  "currentWeek": {
    "weekId": "31",
    "season": "2026",
    "revealAt": "2026-08-05T09:00:00+02:00",
    "timezone": "Europe/Budapest",
    "contestantA": "Adam",
    "contestantB": "Bence",
    "nomineeA": {
      "womanName": "Scarlett Johansson",
      "shortDescription": "Award-winning actress and producer",
      "longerDescription": "Detailed biography here...",
      "imageUrls": [
        "assets/images/2026-w31-adam-scarlett-johansson-01.webp",
        "assets/images/2026-w31-adam-scarlett-johansson-02.webp"
      ],
      "tags": ["actress", "hollywood", "marvel"],
      "sourceNote": "",
      "manuallyEntered": true
    },
    "nomineeB": {
      "womanName": "Margot Robbie",
      "shortDescription": "Australian actress and producer",
      "longerDescription": "Detailed biography here...",
      "imageUrls": [
        "assets/images/2026-w31-bence-margot-robbie-01.webp"
      ],
      "tags": ["actress", "australian", "producer"],
      "sourceNote": "",
      "manuallyEntered": true
    },
    "status": "pending",
    "notes": ""
  }
}
```

### Important Date Format Notes

- **Reveal Time**: Always use `09:00:00+02:00` for summer (CEST) or `09:00:00+01:00` for winter (CET)
- **Day**: Must be a Wednesday
- **Format**: ISO 8601 format: `YYYY-MM-DDTHH:mm:ss+TZ:00`

## 🖼️ Image Management

### Option 1: External Image URLs (Easiest - Recommended)

Use free image hosting services and paste direct image links:

**Popular Image Hosting Services:**
- **Imgur** (https://imgur.com) - Free, no account required, direct links
- **Imgbb** (https://imgbb.com) - Free, simple upload
- **Google Drive** - Share images publicly and use direct link
- **Dropbox** - Share images publicly
- **Cloudinary** - Free tier available
- **GitHub Issues** - Upload to any GitHub issue and copy the URL

**How to Use:**

1. **Upload your image** to any hosting service
2. **Get the direct image URL** (must end in .jpg, .png, .webp, or similar)
   - For Imgur: Right-click image → "Copy image address"
   - For Google Drive: Share → Anyone with link → Get shareable link, then convert to direct link
3. **Paste the URL** into the image URL field in the admin panel

**Example URLs:**
```
https://i.imgur.com/AbCd123.jpg
https://i.ibb.co/xyz123/image.png
https://raw.githubusercontent.com/user/repo/main/image.webp
```

**Detailed Guides for Popular Services:**

**Imgur:**
1. Go to https://imgur.com
2. Click "New post" or drag & drop image
3. After upload, right-click the image
4. Select "Copy image address"
5. Paste into WW admin panel

**Imgbb:**
1. Go to https://imgbb.com
2. Click "Start uploading"
3. Upload your image
4. Copy the "Direct link" from the right side
5. Paste into WW admin panel

**Google Drive (requires extra steps):**
1. Upload image to Google Drive
2. Right-click → Share → Anyone with the link
3. Copy the share link (looks like: `https://drive.google.com/file/d/FILE_ID/view`)
4. Convert to direct link: `https://drive.google.com/uc?export=view&id=FILE_ID`
5. Paste into WW admin panel

**GitHub Issues (clever hack):**
1. Go to any GitHub repository's Issues
2. Click "New issue"
3. Drag & drop your image into the comment box
4. Wait for upload, then copy the generated URL
5. Cancel the issue (don't create it)
6. Paste the URL into WW admin panel

**Pros:**
- ✅ No repository bloat
- ✅ Fast uploads
- ✅ Easy to update
- ✅ Works immediately
- ✅ No Git knowledge needed

**Cons:**
- ⚠️ Depends on external service uptime
- ⚠️ Links may expire if service changes policy

### Option 2: GitHub Repository Storage

Store images directly in your repository:

**How to Use:**

1. Optimize and rename your images using the naming convention
2. Upload them to GitHub via web interface or Git
3. Reference as: `assets/images/2026-w31-adam-nominee-01.webp`
4. Commit and push

**Pros:**
- ✅ Full control
- ✅ Version history
- ✅ No external dependencies

**Cons:**
- ⚠️ Repository size grows
- ⚠️ Requires Git knowledge
- ⚠️ Slower workflow

### Recommended Image Format

- **Format**: WebP (best compression and quality)
- **Fallback**: JPG or PNG also work
- **Size**: Maximum 2MB per image
- **Dimensions**: At least 800x1000px (portrait orientation preferred)

### Image Naming Convention (for GitHub storage only)

If using GitHub repository storage, use this pattern for consistency:
```
YYYY-wWW-contestant-nominee-slug-NN.webp
```

Examples:
```
2026-w31-adam-scarlett-johansson-01.webp
2026-w31-adam-scarlett-johansson-02.webp
2026-w31-bence-margot-robbie-01.webp
```

### Image Optimization Tips

If you're uploading images (whether to hosting service or GitHub), optimize them first:

When a week is revealed and you want to add a new current week:

1. Copy the entire `currentWeek` object from `data/current.json`
2. Open `data/archive.json`
3. Add the copied object to the `entries` array (add it at the beginning for reverse chronological order)
4. Update `status` to `"revealed"`
5. Create a new `currentWeek` in `current.json` for the next week
6. Commit and push both files

Example:

```json
{
  "entries": [
    {
      "weekId": "31",
      "season": "2026",
      "revealAt": "2026-08-05T09:00:00+02:00",
      ...
      "status": "revealed"
    },
    {
      "weekId": "30",
      ...
    }
  ]
}
```

## 🔄 Legacy Data Import

If you have old weekly data in text format:

1. Click the gear icon to open Admin Panel
2. Switch to "Legacy Import" tab
3. Click "Load Example" to see the expected format
4. Paste your legacy text data
5. Click "Parse & Convert"
6. Review any warnings
7. Copy the generated JSON
8. Use it to update `current.json` or add to `archive.json`

### Legacy Format Example

```
Week 32
Reveal: 2026-08-12 09:00
Contestant 1: Adam
Contestant 2: Bence
Adam nominee: Jennifer Lawrence
Adam description: Oscar-winning actress, known for The Hunger Games
Adam images: assets/images/2026-w32-adam-01.webp, assets/images/2026-w32-adam-02.webp
Adam tags: actress, oscar-winner, hollywood
Bence nominee: Emma Watson
Bence description: British actress and activist, famous for Harry Potter
Bence images: assets/images/2026-w32-bence-01.webp
Bence tags: actress, british, harry-potter, activist
```

## ⏰ How Reveal Timing Works

The app uses **Europe/Budapest timezone** as the source of truth:

1. When you visit the site, JavaScript calculates the current time in Budapest
2. It compares this to the `revealAt` timestamp
3. **Before reveal**: Shows locked cards, countdown, and teaser text
4. **At or after reveal**: Shows full nominee information, photos, and details

This works regardless of the visitor's local timezone. A user in New York, Tokyo, or Sydney will all see the reveal at the same moment (Wednesday 09:00 Budapest time).

### Editing Deadline System

**For contestants using individual entry workflow:**

- ✅ **Editable Period**: From the previous Wednesday 09:00 until current Wednesday 08:59
- ⏰ **Deadline**: Wednesday 08:59 Budapest time (1 minute before reveal)
- 🔒 **After Deadline**: Form becomes disabled, no more edits allowed for that week
- ⏱️ **Warning System**: If less than 24 hours remain, you'll see a countdown warning

**How it works:**
1. Open the Admin Panel → Your contestant tab (A or B)
2. If the deadline has passed, you'll see a warning and the form will be disabled
3. If you're within 24 hours of the deadline, you'll see a reminder with time remaining
4. After reveal (09:00), the week moves to archive and you can start fresh for next week

**Example Timeline:**
- **Monday, 8 PM**: You edit your nominee - ✅ Allowed
- **Tuesday, 10 PM**: You edit again - ✅ Allowed  
- **Wednesday, 8:00 AM**: You make final changes - ✅ Allowed
- **Wednesday, 8:59 AM**: Last minute permitted - ✅ Allowed
- **Wednesday, 9:00 AM**: REVEAL - ❌ Editing locked
- **Wednesday, 9:01 AM**: Week is now archived - ✅ Can start next week's entry

### Testing Reveals

To test the reveal mechanism:

1. Set `revealAt` to a few minutes in the future
2. Open the page and watch the countdown
3. When the time arrives, the page automatically updates

## 🎨 Customization

### Theme Colors

Edit the CSS variables in `assets/styles.css`:

```css
:root {
    --accent-primary: #e94560;  /* Main brand color */
    --accent-secondary: #f27121; /* Secondary brand color */
    /* ... other variables ... */
}
```

### Site Title and Subtitle

Update in `data/current.json`:

```json
{
  "site": {
    "title": "WW",
    "subtitle": "Women Crush Wednesday"
  }
}
```

### Logo

The custom SVG logo is defined in `ww.html`. To modify it, edit the `<svg class="logo-svg">` element in the header section.

## 🔒 Security & Privacy Notes

- **Client-Side Only**: All processing happens in the browser, no server-side code
- **Admin Panel**: The admin panel is a convenience tool for generating JSON. It does NOT upload files or save data. Users must manually commit changes to GitHub.
- **No Authentication**: There is no password protection on the admin panel because it cannot make changes on its own
- **Public Data**: All data in the repository is public if your GitHub repository is public

## 🐛 Troubleshooting

### Images Not Loading

**If using external URLs:**
1. Check that the URL is a **direct image link** (ends in .jpg, .png, .webp)
2. Test the URL by pasting it in a new browser tab - should show just the image
3. Some services require specific URL formats:
   - ✅ `https://i.imgur.com/abc123.jpg` (Direct Imgur link)
   - ❌ `https://imgur.com/abc123` (Imgur page link - won't work)
4. Check if the hosting service allows hotlinking (embedding images elsewhere)
5. Verify the image URL is publicly accessible (not behind login/private link)

**If using GitHub paths:**
1. Check the image paths in your JSON files
2. Verify images exist in `assets/images/`
3. Check browser console for 404 errors
4. Ensure image filenames match exactly (case-sensitive)

### Can't Edit My Nominee - Form Disabled

1. Check if it's past the deadline (Wednesday 08:59 Budapest time)
2. If deadline passed, wait for the current week to reveal (09:00)
3. After reveal, the week moves to archive and you can start a fresh entry
4. Check the deadline warning message at the top of your contestant tab

### My Changes Aren't Showing on the Live Site

1. Make sure you committed and pushed to GitHub
2. Wait 1-2 minutes for GitHub Pages to rebuild
3. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
4. Clear browser cache if needed
5. Check that you edited the correct file (`data/current.json`)

### Another Contestant's Data Got Overwritten

This happens if both contestants commit at the same time without pulling first:

1. **Before editing `current.json` on GitHub:**
   - Click the pencil icon to edit
   - GitHub will show you the latest version
2. **Replace only your nominee section** (`nomineeA` or `nomineeB`)
3. **Don't replace the entire file** - keep the other contestant's data
4. **Alternative:** Use GitHub Desktop or Git to pull → edit → commit → push

### Countdown Not Working

1. Verify `revealAt` is in the future
2. Check browser console for JavaScript errors
3. Ensure date format is correct: `YYYY-MM-DDTHH:mm:ss+02:00`

### Archive Not Showing

1. Verify `data/archive.json` exists and is valid JSON
2. Check that `entries` array contains objects
3. Look for JavaScript errors in browser console

### GitHub Pages 404 Error

1. Ensure your repository has GitHub Pages enabled
2. Wait 1-2 minutes after pushing changes
3. Check that your URL includes `/ww.html` at the end
4. Verify all files are pushed to the correct branch

## 📱 Browser Compatibility

- **Recommended**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Required Features**: ES6 JavaScript, CSS Grid, CSS Custom Properties

## 🤝 Contributing

This is a personal hobby project, but suggestions are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is provided as-is for personal use. See LICENSE file for details.

## 🎯 Future Ideas

- [ ] Add contestant profiles page
- [ ] Export archive as PDF
- [ ] Add statistics (most common tags, etc.)
- [ ] Social media share cards
- [ ] RSS feed for new reveals
- [ ] Email notifications (requires external service)

## 📧 Support

For issues or questions, open an issue on the GitHub repository.

---

**Built with ❤️ as a fun hobby project**

Enjoy your Wednesday reveals! 🎉
