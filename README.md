# Nayab's Smart Study Manager

A static, GitHub Pages-ready study planner for the MAKAUT B.Tech CSE Semester V seven-day challenge.

## Files
- `index.html` — dashboard structure
- `styles.css` — responsive styling
- `app.js` — timetable, tasks, timer, reports and local storage

## Publish on GitHub Pages
1. Create a new GitHub repository (for example, `nayab-smart-study-manager`).
2. Upload all three files to the repository root.
3. Open **Settings → Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select branch `main` and folder `/ (root)`, then Save.
6. Wait for GitHub Pages to publish the site. Open the URL shown in the Pages settings.
7. Open the site on your phone and use **Add to Home Screen** from your browser menu.

## Features
- Seven-day, six-hour-per-day timetable.
- Subject progress calculated from completed tasks.
- Add tasks, mark complete, undo and reschedule.
- Pomodoro (25/5), deep work (50/10) and 60-minute timer.
- Focus time is logged against the selected task when a focus session finishes.
- Daily reports, PYQ counts, accuracy and weak-topic notes.
- CSV report export.
- Calendar reminder `.ics` download with three daily sessions and five-minute alarms.
- Links to MAKAUT syllabus, PYQs, study materials and YouTube topic searches.
- Responsive layout for desktop and mobile.
- Data stored in the browser's local storage.

## Notifications and calendar
Use **Add calendar reminders** and import the downloaded `.ics` file into Google Calendar. Check that the calendar's notifications are enabled on your Android device.

Browser notifications from the website itself require the site to be open and permission to be granted. A static GitHub Pages website cannot independently send scheduled push notifications after it has been closed. Google Calendar is the reliable background reminder option.

## Data and privacy
All tasks and reports are saved in the browser's local storage on the device where you use the site. They are not automatically synced between devices or uploaded to ChatGPT, Notion or Google Drive. Export your report periodically if you want a backup.

## Syllabus note
The timetable is an intensive starter plan based on the seven subjects supplied by the student. It is not a substitute for checking the current official MAKAUT syllabus and course-specific unit breakdown. Confirm all units and topics against the official syllabus and your college-issued course outline before treating the syllabus as fully covered.

## Reset
Use **Reset all data** at the bottom of the dashboard to clear local tasks and reports.
