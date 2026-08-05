# Cache Fix Documentation

## Problems Fixed

### 1. ❌ JSON Data Not Updating
**Problem:** Changes to `current-a.json`, `current-b.json`, or `week-config.json` weren't showing on the site without full redeployment.

**Root Cause:** Browser and CDN caching. GitHub Pages and browsers aggressively cache JSON files to improve performance.

**Solution Implemented:**
- Added cache-busting query parameters with timestamps to all JSON fetches
- Added `cache: 'no-store'` option to fetch requests
- Added HTTP cache control meta tags to HTML

### 2. ❌ Images Not Updating / Showing default.png
**Problem:** Image changes weren't reflected on the site, always showing default.png fallback.

**Root Causes:**
- Image URLs being cached by browser
- Quick fallback to default.png on any error
- No logging to debug what was failing

**Solution Implemented:**
- Added cache-busting to all image URLs (both external and local)
- Improved error handling with console logging
- Better image URL validation and resolution

## Technical Details

### Cache-Busting Strategy

**Before:**
```javascript
fetch('data/current-a.json')
```

**After:**
```javascript
const cacheBuster = `?t=${Date.now()}`;
fetch('data/current-a.json' + cacheBuster, { cache: 'no-store' })
// Becomes: data/current-a.json?t=1722873600000
```

Every time the page loads, it uses a different timestamp, forcing the browser to fetch fresh data.

### Image Cache-Busting

**Before:**
```javascript
resolveImageUrl("https://imgur.com/abc123.jpg")
// Returns: https://imgur.com/abc123.jpg
```

**After:**
```javascript
resolveImageUrl("https://imgur.com/abc123.jpg")
// Returns: https://imgur.com/abc123.jpg?_=1722873600000
```

Images now always load fresh versions, not cached copies.

### HTML Meta Tags Added

```html
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
<meta http-equiv="Pragma" content="no-cache">
<meta http-equiv="Expires" content="0">
```

These tell the browser to never cache the page itself.

## How to Verify It's Working

### Test 1: JSON Data Updates

1. Edit `data/current-a.json` and change the `womanName` field
2. Commit and push to GitHub
3. Wait ~1 minute for GitHub Pages to deploy
4. Open your site (or hard refresh: Ctrl+Shift+R)
5. Open browser console (F12)
6. Look for: `Loading data with cache buster: ?t=...`
7. ✅ The new name should appear immediately

### Test 2: Image Updates

1. Change an image URL in `current-a.json` or `current-b.json`
2. Commit and push
3. Wait for deployment
4. Refresh the page
5. Open browser console
6. Look for: `Rendering Participant A's image: https://...?_=...`
7. ✅ New image should load (not default.png)

### Test 3: Manual Reload

If you ever suspect stale data, open browser console and run:

```javascript
wwApp.reload()
```

This forces a fresh fetch of all data without refreshing the page.

## Debugging Tools

### Console Logging

The app now logs useful debugging info:

```javascript
// Data loading
"Loading data with cache buster: ?t=1722873600000"
"Loading from separate files (new format)"
"Week config: {weekId: '31', season: '2026', ...}"
"Participant A: {participantName: '...', nominee: {...}}"
"Participant B: {participantName: '...', nominee: {...}}"
"Final merged currentWeek: {...}"

// Image loading
"Rendering Participant A's image: https://i.imgur.com/abc123.jpg?_=1722873600000"

// Image errors
"Image failed to load: https://i.imgur.com/broken.jpg?_=1722873600000"
```

### Manual Commands

Open browser console (F12) and try:

```javascript
// Force reload all data
wwApp.reload()

// Check current state
console.log(window.wwApp)
```

## Common Issues & Solutions

### Issue: "Still seeing old data after commit"

**Check:**
1. Did GitHub Actions finish deploying? (Check repo's Actions tab)
2. Hard refresh the page: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Open browser console - look for the cache buster timestamp
4. If timestamp is old, clear browser cache completely

**Solution:**
```javascript
// In browser console:
wwApp.reload()
```

### Issue: "Images still showing default.png"

**Check:**
1. Open browser console - look for image URL logs
2. Copy the image URL and paste in new browser tab
3. Does the image load directly?

**Common causes:**
- Image URL is broken/invalid
- Image host is blocking hotlinking
- Image requires authentication
- CORS issues (rare)

**Solution:**
- Use direct image URLs (e.g., `https://i.imgur.com/xyz.jpg`)
- Test URLs in browser first
- Check console for error messages

### Issue: "GitHub Pages not updating"

**Check:**
1. Go to your repo → Actions tab
2. Look for green checkmark on latest commit
3. Deployment should complete in ~1 minute

**If stuck:**
- Try making a trivial change (add a space to README.md)
- Commit and push again
- This triggers a fresh deployment

## Performance Impact

**Q: Won't cache-busting slow down the site?**

A: Minimal impact:
- JSON files are tiny (< 5KB each)
- 3-4 JSON requests on page load
- Images would need revalidation anyway on updates
- Trade-off is worth it for always-fresh content

**Q: Can I disable cache-busting later?**

A: Yes, but not recommended for this use case. If you want to, search for `Date.now()` in `app.js` and remove the cache-busting lines.

## Testing Checklist

Before considering this fixed, test:

- [x] Edit current-a.json → Changes appear on site
- [x] Edit current-b.json → Changes appear on site  
- [x] Edit week-config.json → Changes appear on site
- [x] Change image URL → New image loads
- [x] Break image URL → See error in console (not silent failure)
- [x] Hard refresh → Gets latest data
- [x] wwApp.reload() → Works from console
- [x] Check console logs → See cache buster timestamps

## Additional Notes

### Why Not Server-Side Cache Headers?

GitHub Pages doesn't allow us to configure server cache headers. We can only:
- Control client-side caching (meta tags)
- Add query parameters (cache busting)
- Use fetch options (cache: 'no-store')

This is why we need the timestamp approach.

### Why Timestamp Instead of Version?

Timestamps are automatic and don't require manual updates. Every page load gets a new timestamp, ensuring fresh data. Version numbers would require:
- Manually incrementing on each data change
- Risk of forgetting to update
- More complex logic

Timestamps are simpler and foolproof.

---

**Status:** ✅ All caching issues resolved. Data and images now update immediately on GitHub Pages deployment.
