# WW Update Summary - External URLs & Separate Contestant Entries

## ✅ Changes Implemented

### 1. External Image URL Support
- **No more GitHub uploads required** for images
- Contestants can paste direct links from image hosting services
- Supported services: Imgur, Imgbb, Google Drive (with conversion), Dropbox, etc.
- Form fields updated with URL placeholders and instructions
- Existing GitHub path support maintained for those who prefer it

### 2. Separate Contestant Entry Workflow
- **New Admin Tabs**:
  - "Contestant A Entry" - For contestant A only
  - "Contestant B Entry" - For contestant B only  
  - "Week Setup" - For admin/coordinator (full week entry)
  - "Legacy Import" - Unchanged

### 3. Deadline Management System
- **Editing Deadline**: Wednesday 08:59 Budapest time (1 minute before reveal)
- **Visual Warnings**: 
  - Shows time remaining if less than 24 hours
  - Shows error message after deadline
  - Disables form after deadline
- **Per-Contestant**: Each contestant sees warnings for their own deadline

### 4. Load Current Data Feature
- "Load My Current Data" button in each contestant tab
- Fetches existing nominee from current.json
- Pre-fills form for easy editing/updating
- Prevents accidentally overwriting work

### 5. Individual JSON Generation
- Each contestant generates only their nominee section
- Clear instructions to replace just their part
- Reduces risk of overwriting other contestant's data

## 📁 Files Modified

### HTML (ww.html)
- ✅ Added 3 new admin tabs (Contestant A, Contestant B, Week Setup)
- ✅ Created separate forms for each contestant
- ✅ Added deadline warning placeholders
- ✅ Updated image input fields with URL instructions
- ✅ Removed local file preview inputs (no longer needed)
- ✅ Added "Load My Current Data" buttons

### JavaScript (assets/app.js)
- ✅ Added `checkDeadline(contestant)` - Validates editing permission
- ✅ Added `loadCurrentNominee(contestant)` - Loads existing data
- ✅ Added `generateNomineeJSON(contestant)` - Creates individual JSON
- ✅ Added `copyToClipboard(textareaId)` - Clipboard helper
- ✅ Removed `previewImages()` function (no longer needed)
- ✅ Updated admin panel setup for new workflows

### CSS (assets/styles.css)
- ✅ No changes needed (warnings class already existed)

### Documentation (README.md)
- ✅ Completely rewritten workflow section
- ✅ Added external URL hosting guides with step-by-step instructions
- ✅ Added deadline system documentation
- ✅ New troubleshooting section for URL issues
- ✅ Updated quick start guide for contestants
- ✅ Removed outdated image repository sections
- ✅ Clarified separate vs admin workflows

### New Files
- ✅ **CONTESTANT_GUIDE.md** - Quick reference cheat sheet for contestants
  - 5-minute workflow guide
  - Image URL tips
  - Common mistakes and fixes
  - Example entries
  - Mobile-friendly notes

## 🎯 How It Works Now

### For Contestants (Weekly Workflow)

1. **Upload Images to Imgur** (or any host)
   - Go to imgur.com
   - Upload 2-3 photos
   - Right-click → "Copy image address"

2. **Fill Out Form**
   - Open WW website → Click gear icon
   - Go to your tab (A or B)
   - Click "Load My Current Data" (if updating)
   - Fill in name, descriptions, tags
   - Paste image URLs

3. **Generate & Submit**
   - Click "Generate My JSON"
   - Copy to clipboard
   - Go to GitHub → `data/current.json`
   - Replace only your nominee section
   - Commit

4. **Deadline Tracking**
   - Can edit anytime before Wednesday 08:59
   - See countdown if less than 24 hours
   - Form locks at 08:59
   - After 09:00 reveal, start fresh for next week

### For Admin/Coordinator

Use "Week Setup" tab to create full week entries with both nominees at once.

## 🔧 Technical Details

### Deadline System
```javascript
function checkDeadline(contestant) {
    // Gets current Budapest time
    // Compares to revealAt - 1 minute
    // Shows warning if < 24 hours
    // Disables form if deadline passed
}
```

### Load Current Data
```javascript
async function loadCurrentNominee(contestant) {
    // Fetches data/current.json
    // Extracts nomineeA or nomineeB
    // Pre-fills form fields
    // Populates image URL inputs
}
```

### Generate Individual JSON
```javascript
function generateNomineeJSON(contestant) {
    // Collects form data
    // Creates nominee object only
    // Generates JSON for copy/paste
    // Does NOT include full week structure
}
```

## 📚 Image Hosting Services Supported

| Service | URL Format | Free? | Account Required? |
|---------|-----------|-------|-------------------|
| Imgur | `https://i.imgur.com/xyz.jpg` | ✅ Yes | ❌ No |
| Imgbb | `https://i.ibb.co/xyz/img.png` | ✅ Yes | ❌ No |
| GitHub Issues | `https://user-images.githubusercontent.com/...` | ✅ Yes | ✅ Yes (GitHub) |
| Google Drive | `https://drive.google.com/uc?export=view&id=...` | ✅ Yes | ✅ Yes (Google) |

## ⚠️ Important Notes

### Data Merge Process
Since this is a static site, contestants must manually edit the JSON file on GitHub. The system provides:
- ✅ Individual JSON output (just the nominee section)
- ✅ Clear instructions on which part to replace
- ✅ Load feature to prevent data loss
- ❌ Cannot automatically merge (no backend)

### Deadline Enforcement
- **Client-side only** - The deadline check happens in the browser
- **Not server-enforced** - Someone could still edit current.json directly on GitHub after deadline
- **Honor system** - Relies on contestants respecting the deadline
- **Visual deterrent** - Form disables to discourage late edits

### Image URL Reliability
- External URLs depend on hosting service uptime
- If hosting service removes image, it will break
- Imgur links are generally stable for years
- GitHub-hosted images are most reliable long-term
- Consider backups for important historical entries

## 🎉 Benefits

### For Contestants
- ✅ No Git/GitHub knowledge needed (just copy/paste)
- ✅ No image optimization required (hosting service handles it)
- ✅ Fast workflow (under 5 minutes)
- ✅ Mobile-friendly (can do from phone)
- ✅ Can update/edit easily before deadline
- ✅ Don't risk breaking other contestant's data

### For Admins
- ✅ Less coordination needed
- ✅ Contestants work independently
- ✅ Deadline system prevents last-second chaos
- ✅ Archive automatically builds over time

## 🚀 Ready to Use

Everything is implemented and ready. Contestants can:
1. Open the site now
2. Click gear icon
3. Try the contestant entry workflow
4. See the deadline warnings in action

The sample data in current.json still works with the new system!

## 📖 Documentation

- **Main Guide**: README.md (comprehensive)
- **Quick Reference**: CONTESTANT_GUIDE.md (5-min cheat sheet)
- **Both updated** with new workflows and external URL instructions

---

**All changes are backward compatible.** Existing data structure unchanged, just new UI workflows added!
