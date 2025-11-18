import { useState, useEffect } from 'react';
import './Game.css';

function Game({ words, timeLimit, onEndGame }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);

  const currentWord = words[currentIndex];
  const progress = currentIndex + 1;
  const totalWords = words.length;

  // Timer effect
  useEffect(() => {
    if (timeLimit === null || gameEnded) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameEnded(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLimit, gameEnded]);

  const handleCorrect = () => {
    setCorrectCount(correctCount + 1);
    moveToNext();
  };

  const handleSkip = () => {
    setSkippedCount(skippedCount + 1);
    moveToNext();
  };

  const moveToNext = () => {
    if (currentIndex < totalWords - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setGameEnded(true);
    }
  };

  const handlePlayAgain = () => {
    onEndGame();
  };

  // Format time remaining
  const formatTime = (seconds) => {
    if (seconds === null) return '∞';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (gameEnded) {
    const percentage = Math.round((correctCount / totalWords) * 100);

    return (
      <div className="game-container">
        <div className="game-card summary-card">
          <h1 className="summary-title">Game Over!</h1>

          <div className="summary-stats">
            <div className="stat-item">
              <div className="stat-value correct">{correctCount}</div>
              <div className="stat-label">Correct</div>
            </div>
            <div className="stat-item">
              <div className="stat-value skipped">{skippedCount}</div>
              <div className="stat-label">Skipped</div>
            </div>
            <div className="stat-item">
              <div className="stat-value percentage">{percentage}%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>

          <div className="summary-message">
            {percentage >= 80 && "Outstanding performance! 🎉"}
            {percentage >= 60 && percentage < 80 && "Great job! 👏"}
            {percentage >= 40 && percentage < 60 && "Good effort! 👍"}
            {percentage < 40 && "Keep practicing! 💪"}
          </div>

          <button className="play-again-button" onClick={handlePlayAgain}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="game-container">
      <div className="game-header">
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${(progress / totalWords) * 100}%` }}
          ></div>
        </div>
        <div className="header-info">
          <div className="progress-text">
            Card {progress} of {totalWords}
          </div>
          {timeLimit !== null && (
            <div className={`timer ${timeRemaining <= 10 ? 'timer-warning' : ''}`}>
              {formatTime(timeRemaining)}
            </div>
          )}
        </div>
      </div>

      <div className="game-card">
        <div className="card-header">
          <h2 className="card-title">Describe this word:</h2>
        </div>

        <div className="main-word">{currentWord.word}</div>

        <div className="taboo-section">
          <div className="taboo-header">Taboo Words (Don't Say!):</div>
          <div className="taboo-words">
            {currentWord.tabooWords.map((tabooWord, index) => (
              <div key={index} className="taboo-word">
                {tabooWord}
              </div>
            ))}
          </div>
        </div>

        <div className="button-group">
          <button className="game-button skip-button" onClick={handleSkip}>
            Skip
          </button>
          <button className="game-button correct-button" onClick={handleCorrect}>
            Correct
          </button>
        </div>
      </div>

      <div className="score-display">
        <div className="score-item">
          <span className="score-label">Correct:</span>
          <span className="score-value correct">{correctCount}</span>
        </div>
        <div className="score-item">
          <span className="score-label">Skipped:</span>
          <span className="score-value skipped">{skippedCount}</span>
        </div>
      </div>
    </div>
  );
}

export default Game;
