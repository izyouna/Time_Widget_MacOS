# Productivity Timer (macOS) ⏱️

A beautiful, deep dark minimalist productivity timer built for macOS using Electron. It features a frameless design that floats seamlessly on your desktop.

## Features
- **Frameless & Transparent Window:** Integrates naturally with your macOS desktop without bulky window borders.
- **Draggable & Resizable:** Move the widget freely around your screen, minimize it to the Dock, and resize it as needed.
- **Stopwatch Mode:** Simple count-up timer.
- **Pomodoro Mode:** 25-minute work interval with muted red accent colors.
- **Short Break Mode:** 5-minute break timer.
- **Custom Mode (Persistent):** Set your own time limit using the on-screen +/- buttons. The app remembers your custom time!
- **Time Adjustments:** Hover over the timer or use the persistent buttons in Custom Mode to add or remove minutes on the fly.
- **Alarm Sound:** A built-in double-beep alarm alerts you when any countdown finishes.
- **Deep Dark Theme:** High-contrast, sleek aesthetic using `#0d0d0d` backgrounds and the Inter font.

## Installation (Recommended)

You can easily install the app permanently on your Mac using the pre-built installer:

1. Open the `dist/` folder in this project.
2. Double-click the **`Productivity Timer-0.2.0-arm64.dmg`** file. (Note: You may need to run `npm run build` first to generate the new version).
3. A small window will appear. Drag and drop the **Productivity Timer** icon into the **Applications** folder shortcut.
4. You can now launch the app anytime from your Mac's **Launchpad** or **Applications** folder!

*(Note: Since this is an unsigned developer app, upon first launch macOS might block it. If so, go to **System Settings > Privacy & Security**, scroll down, and click "Open Anyway" for Productivity Timer.)*

## Development Guide

If you want to modify the source code or run it in development mode:

### Prerequisites
- Node.js (v16+)
- npm

### Setup
1. Open the terminal in this directory.
2. Install dependencies:
   ```bash
   npm install
   ```

### Run
Launch the app in development mode:
```bash
npm start
```

### Build
Package the app into a new `.dmg` file:
```bash
npm run build
```
*(The new `.dmg` and `.app` files will be generated inside the `dist/` folder)*
