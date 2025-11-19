# Testing Guide for Emergency Button Feature

## Quick Start

1. **Start the development server:**
   ```bash
   cd app
   npm install  # if you haven't already
   npm run dev
   ```

2. **Open the app in your browser:**
   - The app should automatically open at `http://localhost:3000`
   - If not, navigate to that URL manually

## Testing Steps

### 1. Test Emergency Contact Setup

**Test Adding an Emergency Contact:**
1. Scroll down to find the "Emergency Contact" section on the Home page
2. Click "Add Emergency Contact"
3. Enter a test name (e.g., "Test Contact")
4. Enter a test phone number (e.g., "555-123-4567" or your own phone number)
5. Click "Save"
6. Verify the contact appears and is saved

**Test Editing an Emergency Contact:**
1. Click "Edit" next to the emergency contact
2. Change the name or phone number
3. Click "Save"
4. Verify the changes are saved

**Test Removing an Emergency Contact:**
1. Click "Remove Emergency Contact"
2. Confirm the removal
3. Verify the contact is removed

**Test Persistence:**
1. Add an emergency contact
2. Refresh the page (F5 or Cmd+R)
3. Verify the contact is still there (stored in localStorage)

### 2. Test Location Permissions

**First Time:**
1. When you trigger the emergency button, your browser will ask for location permission
2. Click "Allow" to grant permission
3. The location should be retrieved

**Test Location Denial:**
1. In browser settings, deny location permission
2. Trigger the emergency button
3. The app should handle the error gracefully and still attempt to send SMS (without location)

### 3. Test Emergency Button Trigger

**Test the Hold-to-Activate:**
1. Make sure you have an emergency contact set up
2. Press and hold the red emergency button
3. Watch the progress bar fill up over 3 seconds
4. Release before 3 seconds - nothing should happen
5. Hold for the full 3 seconds - the emergency should trigger

**What Should Happen:**
- Button changes to "Calling Emergency..." state
- Location is retrieved (you'll see a browser permission prompt if first time)
- SMS app opens with pre-filled message containing:
  - "EMERGENCY: I need help!"
  - Google Maps link with your coordinates (if location available)
  - Or "Location unavailable" if location couldn't be retrieved

### 4. Test SMS Functionality

**On Desktop (Chrome/Edge):**
- SMS protocol may not work directly
- You can test by checking the console logs
- The URL should be generated: `sms:PHONENUMBER?body=MESSAGE`

**On Mobile Device (Best Testing):**
1. Connect your phone to the same network
2. Access the app via your computer's IP address (e.g., `http://192.168.1.XXX:3000`)
   - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Or use a mobile emulator/tool like Chrome DevTools device emulation
4. On a real mobile device, the SMS app should open automatically

**Test SMS Message Content:**
- The message should include:
  - "EMERGENCY: I need help!"
  - A Google Maps link (if location available)
  - Example: `EMERGENCY: I need help! My location: https://www.google.com/maps?q=37.7749,-122.4194`

### 5. Test Error Handling

**Test Without Emergency Contact:**
1. Remove the emergency contact
2. Try to trigger the emergency button
3. Should show an alert: "No emergency contact configured. Please set up an emergency contact in settings."

**Test Location Error:**
1. Deny location permission
2. Trigger emergency button
3. SMS should still be sent but with "Location unavailable" message

## Browser Console Testing

Open browser DevTools (F12) and check the console for:
- Location retrieval logs
- Any error messages
- SMS URL generation

## Manual Testing Checklist

- [ ] Can add emergency contact
- [ ] Can edit emergency contact
- [ ] Can remove emergency contact
- [ ] Contact persists after page refresh
- [ ] Location permission prompt appears (first time)
- [ ] Location is retrieved successfully
- [ ] Emergency button requires 3-second hold
- [ ] Releasing early cancels the action
- [ ] SMS app opens with correct phone number
- [ ] SMS message contains emergency text
- [ ] SMS message contains location link (when available)
- [ ] Error handling works when no contact is set
- [ ] Error handling works when location is denied

## Testing on Different Devices

### Desktop Browser
- Location: ✅ Works (with permission)
- SMS: ⚠️ Limited (may not open SMS app, but URL is generated)

### Mobile Browser (iOS Safari)
- Location: ✅ Works
- SMS: ✅ Works (opens Messages app)

### Mobile Browser (Android Chrome)
- Location: ✅ Works
- SMS: ✅ Works (opens default SMS app)

## Troubleshooting

**Location not working:**
- Check browser permissions in Settings
- Make sure you're using HTTPS or localhost (required for geolocation)
- Check browser console for errors

**SMS not opening:**
- On desktop, SMS protocol may not be supported
- Try on a mobile device for full functionality
- Check that phone number format is correct (digits only in the URL)

**Contact not saving:**
- Check browser console for errors
- Verify localStorage is enabled in your browser
- Check browser DevTools > Application > Local Storage

