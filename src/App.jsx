import { useState } from 'react';
import Home from './components/Home';
import Game from './components/Game';
import { generateTabooWords } from './services/claudeService';
import './App.css';

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [words, setWords] = useState([]);
  const [timeLimit, setTimeLimit] = useState(null);

  const handleStartGame = async (category, difficulty, wordCount, timeLimitSeconds, tabooWordCount) => {
    const generatedWords = await generateTabooWords(category, difficulty, wordCount, tabooWordCount);
    setWords(generatedWords);
    setTimeLimit(timeLimitSeconds);
    setGameStarted(true);
  };

  const handleEndGame = () => {
    setGameStarted(false);
    setWords([]);
    setTimeLimit(null);
  };

  return (
    <div className="app">
      {!gameStarted ? (
        <Home onStartGame={handleStartGame} />
      ) : (
        <Game words={words} timeLimit={timeLimit} onEndGame={handleEndGame} />
      )}
    </div>
  );
}

export default App;
