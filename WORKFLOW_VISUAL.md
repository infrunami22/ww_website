# Visual Workflow Guide for Contestants

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  WEEKLY WORKFLOW - 5 MINUTES PER WEEK                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

STEP 1: UPLOAD IMAGES (2 minutes)
════════════════════════════════════════════════════════════════
    
    Go to Imgur.com
         │
         ▼
    Click "New post"
         │
         ▼
    Upload 2-3 photos
         │
         ▼
    Right-click each image → "Copy image address"
         │
         ▼
    Save URLs in notepad
         │
         ▼
    URLs look like: https://i.imgur.com/AbCd123.jpg
                    https://i.imgur.com/XyZ789.png


STEP 2: FILL OUT YOUR FORM (2 minutes)
════════════════════════════════════════════════════════════════

    Open WW website
         │
         ▼
    Click ⚙️ gear icon (top-right)
         │
         ▼
    ┌─────────────────────────────────────────────────────────┐
    │ Click your tab:                                         │
    │  • "Contestant A Entry" (if you're Contestant A)        │
    │  • "Contestant B Entry" (if you're Contestant B)        │
    └─────────────────────────────────────────────────────────┘
         │
         ▼
    Click "Load My Current Data" (if updating existing)
         │
         ▼
    Fill in form:
         │
         ├── Woman Name: [Zendaya_____________]
         │
         ├── Short Description: [Emmy-winning actress and fashion icon]
         │
         ├── Longer Description: [From Euphoria to Dune, she brings...]
         │
         ├── Tags: [actress, singer, fashion________________]
         │
         ├── Image URL 1: [https://i.imgur.com/AbCd123.jpg]
         │
         ├── Image URL 2: [https://i.imgur.com/XyZ789.png]
         │
         └── Image URL 3: [_________________________________]


STEP 3: GENERATE JSON (30 seconds)
════════════════════════════════════════════════════════════════

    Click "Generate My JSON"
         │
         ▼
    JSON appears in text box below
         │
         ▼
    Click "Copy to Clipboard"


STEP 4: UPDATE GITHUB (30 seconds)
════════════════════════════════════════════════════════════════

    Go to GitHub.com → Your repository
         │
         ▼
    Navigate to: data/current.json
         │
         ▼
    Click ✏️ (Edit this file)
         │
         ▼
    Find your section:
         │
         ├── Contestant A: Find "nomineeA": {
         │                        │
         │                        ▼
         │                  Select from { to matching }
         │
         └── Contestant B: Find "nomineeB": {
                                │
                                ▼
                          Select from { to matching }
         │
         ▼
    Paste your JSON (Ctrl+V)
         │
         ▼
    Scroll down → Click "Commit changes"
         │
         ▼
    ✅ Done! Wait 2 minutes for site to update


═══════════════════════════════════════════════════════════════════
TIMELINE EXAMPLE
═══════════════════════════════════════════════════════════════════

  Monday 8:00 PM
  ┌─────────────────────────────────────────────────┐
  │ You prepare and submit your nominee             │
  │ Status: ✅ Can edit                             │
  └─────────────────────────────────────────────────┘
              │
              │ Time passes...
              ▼
  Tuesday 6:00 PM
  ┌─────────────────────────────────────────────────┐
  │ You decide to update the description            │
  │ Status: ✅ Can edit                             │
  └─────────────────────────────────────────────────┘
              │
              │ Time passes...
              ▼
  Wednesday 8:00 AM (Budapest time)
  ┌─────────────────────────────────────────────────┐
  │ You make final tweaks                           │
  │ Status: ✅ Can edit (59 minutes left)           │
  │ Warning: ⏰ Less than 1 hour remaining!         │
  └─────────────────────────────────────────────────┘
              │
              │ Time passes...
              ▼
  Wednesday 8:59 AM
  ┌─────────────────────────────────────────────────┐
  │ DEADLINE REACHED                                │
  │ Status: 🔒 LOCKED - Cannot edit anymore        │
  └─────────────────────────────────────────────────┘
              │
              │ 1 minute later...
              ▼
  Wednesday 9:00 AM
  ┌─────────────────────────────────────────────────┐
  │ 🎉 REVEAL TIME!                                 │
  │ Your nominee is now visible to everyone         │
  │ Week moves to archive                           │
  └─────────────────────────────────────────────────┘
              │
              │ 
              ▼
  Wednesday 9:01 AM onwards
  ┌─────────────────────────────────────────────────┐
  │ Start fresh for next week                       │
  │ Status: ✅ Can create new entry                 │
  └─────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════
EXAMPLE: Finding Your Section in current.json
═══════════════════════════════════════════════════════════════════

The file looks like this:

{
  "site": { ... },
  "currentWeek": {
    "weekId": "31",
    "season": "2026",
    "contestantA": "Adam",
    "contestantB": "Bence",
    
    ┌──────────────────────────────────────────────────┐
    │ "nomineeA": {                    ← CONTESTANT A  │
    │   "womanName": "Scarlett Johansson",             │
    │   "shortDescription": "...",                     │
    │   "longerDescription": "...",                    │
    │   "imageUrls": [ ... ],                          │
    │   "tags": [ ... ]                                │
    │ },                                               │
    └──────────────────────────────────────────────────┘
    
    ┌──────────────────────────────────────────────────┐
    │ "nomineeB": {                    ← CONTESTANT B  │
    │   "womanName": "Margot Robbie",                  │
    │   "shortDescription": "...",                     │
    │   "longerDescription": "...",                    │
    │   "imageUrls": [ ... ],                          │
    │   "tags": [ ... ]                                │
    │ }                                                │
    └──────────────────────────────────────────────────┘
  }
}

⚠️  IMPORTANT: 
    - Only replace YOUR section (nomineeA OR nomineeB)
    - Keep the other contestant's data intact
    - Don't delete commas or brackets


═══════════════════════════════════════════════════════════════════
TESTING YOUR IMAGE URLS
═══════════════════════════════════════════════════════════════════

Copy your URL → Paste in new browser tab

  ✅ GOOD:                              ❌ BAD:
  ┌──────────────────────────────┐     ┌──────────────────────────────┐
  │ Browser shows ONLY the image │     │ Browser shows a webpage      │
  │ No website, no menus         │     │ with the image on it         │
  └──────────────────────────────┘     └──────────────────────────────┘


═══════════════════════════════════════════════════════════════════
MOBILE WORKFLOW
═══════════════════════════════════════════════════════════════════

Yes, you can do everything from your phone! 📱

    1. Use Imgur mobile app
       └─→ Upload photos
       └─→ Share → Copy link
    
    2. Open WW website in mobile browser
       └─→ Works perfectly on phones
       └─→ Tap gear icon → Your tab
       └─→ Fill form → Generate
    
    3. Use GitHub mobile app
       └─→ Navigate to current.json
       └─→ Edit → Paste → Commit


═══════════════════════════════════════════════════════════════════
COMMON MISTAKES & FIXES
═══════════════════════════════════════════════════════════════════

Mistake: "I uploaded to Imgur but image won't load"
Fix: Make sure you copied the DIRECT image link
     Right-click image → "Copy image address" 
     NOT the gallery page URL

Mistake: "The other contestant's data disappeared!"
Fix: You replaced the entire file instead of just your section
     Go to GitHub → History → Find previous version
     Restore the other person's section

Mistake: "Form says 'Deadline passed' but it's only Tuesday"
Fix: Check your timezone. Deadline is Budapest time (CET/CEST)
     Use a timezone converter if unsure

Mistake: "My changes aren't showing on the website"
Fix: 1. Wait 2 minutes for GitHub Pages to rebuild
     2. Hard refresh browser (Ctrl+Shift+R)
     3. Check you committed the changes on GitHub


═══════════════════════════════════════════════════════════════════
QUESTIONS?
═══════════════════════════════════════════════════════════════════

→ Check CONTESTANT_GUIDE.md for quick tips
→ Check README.md for detailed documentation
→ Ask the other contestant or coordinator
→ Press F12 in browser to check for errors

═══════════════════════════════════════════════════════════════════

Remember: Don't procrastinate! Deadline is Wednesday 08:59 sharp! ⏰
```
