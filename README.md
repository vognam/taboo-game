# Taboo Game Web App

A fun and interactive Taboo word game built with React and Vite, powered by Claude AI for dynamic word generation.

## Features

- **Dynamic Word Generation**: Uses Claude AI to generate 20 unique Taboo cards with 5 taboo words each
- **Customizable Categories**: Choose any category (e.g., movies, sports, technology, general)
- **Difficulty Levels**: Three difficulty settings (Easy, Medium, Hard) to match your skill level
- **Interactive Card UI**: Beautiful card-based interface showing one word at a time
- **Progress Tracking**: Track your correct answers and skipped cards
- **Score Summary**: See your performance stats at the end of each game

## How to Play

1. Enter a category (or use the default "general")
2. Select a difficulty level
3. Click "Start Game" to generate 20 Taboo cards
4. Describe the main word to your team without saying any of the 5 taboo words
5. Click "Correct" if your team guessed it, or "Skip" to move on
6. View your score summary at the end

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Claude API Key

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file and add your Anthropic API key:

```
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

You can get an API key from [Anthropic Console](https://console.anthropic.com/).

### 3. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Important Notes

- **API Key Security**: This app uses `dangerouslyAllowBrowser: true` for the Anthropic SDK, which means the API key is exposed in the browser. This is fine for development and personal use, but for production applications, you should move the API calls to a backend server.
- **Cost**: Each game generates 20 words using Claude AI, which consumes API credits. Be mindful of your usage.

## Tech Stack

- **React**: UI framework
- **Vite**: Build tool and dev server
- **Anthropic SDK**: Claude AI integration
- **CSS**: Custom styling with gradients and animations

## Project Structure

```
src/
├── components/
│   ├── Home.jsx          # Home page with category input and difficulty selector
│   ├── Home.css          # Home page styling
│   ├── Game.jsx          # Game component with card UI and controls
│   └── Game.css          # Game styling
├── services/
│   └── claudeService.js  # Claude API integration
├── App.jsx               # Main app component
├── App.css               # App styling
├── index.css             # Global styles
└── main.jsx              # App entry point
```

## License

MIT
