# Fragments of the Oracle

A mobile puzzle game about biblical messianic prophecies. Players work through an ancient archive, reconstructing texts, matching contexts, and evaluating evidence — gradually discovering the original meaning behind passages that are often quoted out of context.

**Full disclosure: this is a 100% AI written app. It is an experiment to see what can be done with no code.**

## Play Now

**[Play in your browser](https://mctrivia.github.io/FragmentsOfTheOracle/)** — no install required, works on desktop and mobile.

## How to Run Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)

### Install & Start

```bash
# Clone the repo
git clone https://github.com/mctrivia/FragmentsOfTheOracle.git
cd FragmentsOfTheOracle

# Install dependencies
npm install

# Start the dev server
npx expo start
```

Once the dev server is running:

- **Web:** Press `w` to open in your browser
- **iOS:** Press `i` to open in iOS Simulator (requires Xcode)
- **Android:** Press `a` to open in Android emulator (requires Android Studio)
- **Phone:** Scan the QR code with the Expo Go app

### Build for Production

```bash
# Web export
npx expo export --platform web

# Native builds (requires EAS CLI)
npm install -g eas-cli
eas build --platform android
eas build --platform ios
```

## Tech Stack

- Expo / React Native
- TypeScript
- React Navigation
- AsyncStorage for save data

## Game Structure

- 16 levels across 5 archive rooms
- 7 puzzle types: reconstruction, context match, genre, geography, timeline, translation, investigation board, and prophecy check
- Data-driven level design (all content loaded from JSON)
- Progress saved locally
