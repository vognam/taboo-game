import { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import { generateTabooWords } from './services/claudeService';
import mockWordsData from './data/mockWords.json';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [words, setWords] = useState([]);
  const [timeLimit, setTimeLimit] = useState(null);
  const [maxSkips, setMaxSkips] = useState(null);

  const handleStartGame = async (category, difficulty, wordCount, timeLimitSeconds, tabooWordCount, maxSkipsAllowed, devMode) => {
    let generatedWords;

    if (devMode) {
      // Use mock data in dev mode
      // Select the requested number of words
      const selectedWords = mockWordsData.slice(0, wordCount);

      // Trim taboo words to the requested count
      generatedWords = selectedWords.map(word => ({
        word: word.word,
        tabooWords: word.tabooWords.slice(0, tabooWordCount)
      }));
    } else {
      // Use Claude API in normal mode
      generatedWords = await generateTabooWords(category, difficulty, wordCount, tabooWordCount);
    }

    setWords(generatedWords);
    setTimeLimit(timeLimitSeconds);
    setMaxSkips(maxSkipsAllowed);
    setGameStarted(true);
  };

  const handleEndGame = () => {
    setGameStarted(false);
    setWords([]);
    setTimeLimit(null);
    setMaxSkips(null);
  };

  return (
    <div className="app">
      {!gameStarted ? (
        <Home onStartGame={handleStartGame} />
      ) : (
        <Game words={words} timeLimit={timeLimit} maxSkips={maxSkips} onEndGame={handleEndGame} />
      )}
    </div>
  );
}

export default App;
