# Contestant Quick Reference Guide

## 📝 Weekly Workflow (5 Minutes)

### Step 1: Prepare Your Images
1. Find 2-3 photos of your nominee
2. Upload to **Imgur** (easiest): https://imgur.com
   - Click "New post" 
   - Upload images
   - Right-click each → "Copy image address"
3. Save the URLs in a notepad

### Step 2: Fill Out Your Entry
1. Go to the WW website
2. Click the ⚙️ gear icon (top-right)
3. Click your tab: **"Contestant A Entry"** or **"Contestant B Entry"**
4. Click **"Load My Current Data"** (if updating existing entry)
5. Fill in the form:
   - **Woman Name**: Full name
   - **Short Description**: One catchy line (e.g., "Award-winning actress and producer")
   - **Longer Description**: 2-3 sentences about why you picked her
   - **Tags**: Keywords separated by commas (e.g., "actress, singer, fashion")
   - **Image URLs**: Paste the Imgur URLs you copied

### Step 3: Generate and Submit
1. Click **"Generate My JSON"**
2. Click **"Copy to Clipboard"**
3. Go to GitHub → Your repository → `data/current.json`
4. Click the pencil icon (✏️ Edit)
5. Find your section:
   - **Contestant A**: Find `"nomineeA": {`
   - **Contestant B**: Find `"nomineeB": {`
6. Select from opening `{` to closing `}` of your nominee section
7. Paste your new JSON (Ctrl+V / Cmd+V)
8. Scroll down → Click **"Commit changes"**
9. Done! 🎉

---

## ⏰ Important Deadlines

- **Editable Period**: Monday through Wednesday 08:59 AM (Budapest time)
- **Final Deadline**: Wednesday 08:59 AM
- **Reveal Time**: Wednesday 09:00 AM
- **After Reveal**: Week is archived, start fresh for next week

---

## 🖼️ Image URL Tips

### ✅ Good URLs (Direct Image Links)
```
https://i.imgur.com/XyZ123.jpg
https://i.imgur.com/AbC456.png
https://i.ibb.co/xyz/image.webp
```

### ❌ Bad URLs (Won't Work)
```
https://imgur.com/gallery/xyz     (Gallery page, not image)
https://drive.google.com/file/... (Not direct link)
```

### How to Test Your URL
Paste URL in a new browser tab. If you see ONLY the image (no website around it), it's good!

---

## 🆘 Quick Fixes

**"Form is disabled"**
→ Deadline passed. Wait for reveal at 09:00, then start next week's entry.

**"Images not showing"**
→ Make sure URLs end in .jpg, .png, or .webp
→ Test URL in new browser tab

**"Changes not appearing"**
→ Wait 2 minutes after committing
→ Hard refresh (Ctrl+Shift+R)

**"Other contestant's data disappeared"**
→ You overwrote the whole file! 
→ Go to GitHub → History → Find previous version
→ Copy the other contestant's section back
→ This time, replace ONLY your section

---

## 📱 Mobile-Friendly

You can do everything from your phone:
1. Use Imgur app to upload photos
2. Use GitHub app to edit current.json
3. Admin panel works on mobile browsers

---

## 💡 Pro Tips

1. **Prepare early**: Upload images on Monday, finalize on Tuesday
2. **Use tags**: Makes archive searchable later
3. **Write genuine descriptions**: Makes reveals more fun
4. **Test URLs**: Click your image links before committing
5. **Check the preview**: Visit site after committing to see your entry

---

## 📋 Example Entry

```json
{
  "womanName": "Zendaya",
  "shortDescription": "Emmy-winning actress and fashion icon",
  "longerDescription": "From Euphoria to Dune, Zendaya brings incredible talent and style to every role. Her red carpet looks are always bold and her performances are powerful.",
  "imageUrls": [
    "https://i.imgur.com/example1.jpg",
    "https://i.imgur.com/example2.jpg"
  ],
  "tags": ["actress", "singer", "fashion", "euphoria"],
  "sourceNote": "",
  "manuallyEntered": true
}
```

---

## 🤝 Collaboration Etiquette

1. **Don't edit the entire file** - Just your section
2. **Always load current data first** - To see what's already there
3. **Commit early** - Don't wait until 08:59 Wednesday
4. **Communicate** - Let the other contestant know if you're working on it

---

## 🎯 Common Mistakes to Avoid

❌ Waiting until Wednesday morning
❌ Using gallery URLs instead of direct image links
❌ Replacing the entire current.json file
❌ Not testing image URLs before committing
❌ Forgetting to commit changes on GitHub

✅ Preparing early
✅ Using direct image URLs
✅ Replacing only your nominee section
✅ Testing everything before deadline
✅ Committing and verifying changes

---

## 📧 Need Help?

1. Check the main README.md for detailed guides
2. Test on a branch first if you're unsure
3. Ask the other contestant or coordinator
4. Check browser console for errors (F12 key)

---

**Remember:** The system locks at 08:59 Wednesday. Don't procrastinate! 🕐
