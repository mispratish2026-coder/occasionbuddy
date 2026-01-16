# ⚠️ CRITICAL: Update Firebase Firestore Rules

## Problem
You're getting "Missing or insufficient permissions" error when trying to update support tickets.

## Solution: Update Firestore Rules in Firebase Console

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com)
2. Select your **OccasionBuddy** project
3. Go to **Firestore Database**
4. Click on **Rules** tab

### Step 2: Replace All Rules
1. Delete ALL existing rules
2. Copy ALL content from: `firestore.rules` file in the project
3. Paste into the Firebase Console Rules editor
4. Click **Publish**

### Step 3: Wait for Deployment
- Rules will deploy in 1-2 minutes
- You'll see a checkmark when done

### Step 4: Test
1. Go to Admin Support page
2. Try to change a ticket status
3. It should now work!

---

## Quick Checklist
- [ ] Opened Firebase Console
- [ ] Went to Firestore > Rules
- [ ] Copied firestore.rules content
- [ ] Pasted into console
- [ ] Clicked Publish
- [ ] Waited 2 minutes
- [ ] Tested support ticket update

## Common Issues

**Still getting permission error?**
- Clear browser cache (Ctrl+Shift+Delete)
- Log out and back in
- Wait 5 minutes for rules to fully propagate

**Can't find Rules tab?**
- You're in wrong project
- Or Firestore isn't initialized yet

**Still stuck?**
- Make sure your user has `role: "admin"` in users collection
- Check Firestore console that users collection exists

---

## What These Rules Do
✅ Users can create support tickets  
✅ Admins can read all tickets  
✅ Admins can update ticket status  
✅ Users can only see their own tickets  
✅ Protects data from unauthorized access
