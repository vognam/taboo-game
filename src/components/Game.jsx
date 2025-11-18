import { useState, useEffect } from 'react';
import './Game.css';

function Game({ words, timeLimit, maxSkips, onEndGame }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [skippedCards, setSkippedCards] = useState([]); // Array of skipped card indices
  const [cyclingMode, setCyclingMode] = useState(false); // Are we cycling through skipped cards?
  const [cycleIndex, setCycleIndex] = useState(0); // Current position in skipped cards array
  const [visitedCards, setVisitedCards] = useState([0]); // Track which cards have been visited

  // Safety check for cycle index
  const safeCycleIndex = cyclingMode && cycleIndex >= skippedCards.length
    ? 0
    : cycleIndex;

  const currentWord = cyclingMode
    ? words[skippedCards[safeCycleIndex]]
    : words[currentIndex];
  const progress = currentIndex + 1;
  const totalWords = words.length;
  const skipsRemaining = maxSkips !== null ? maxSkips - skippedCount : null;
  const canSkip = maxSkips === null || skippedCount < maxSkips;

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

    if (cyclingMode) {
      // Got a card correct during cycling mode
      const correctCardIndex = skippedCards[safeCycleIndex];
      const isCurrentCard = correctCardIndex === currentIndex;

      // Remove this card from skipped pool
      const newSkippedCards = skippedCards.filter((_, i) => i !== safeCycleIndex);
      setSkippedCards(newSkippedCards);

      // Regain skip only if this was NOT the current card (i.e., it was actually skipped before)
      if (!isCurrentCard) {
        setSkippedCount(skippedCount - 1);
      }

      // Check if there are more skipped cards or unvisited cards
      if (newSkippedCards.length === 0) {
        // No more skipped cards
        setCyclingMode(false);
        setCycleIndex(0);

        // Check if we have unvisited cards
        const hasUnvisitedCards = currentIndex + 1 < totalWords &&
          !visitedCards.includes(currentIndex + 1);

        if (isCurrentCard) {
          // Current card was correct - try to move to next
          moveToNext();
        } else if (!hasUnvisitedCards) {
          // Was a skipped card and no unvisited cards left - end game
          setGameEnded(true);
        }
        // Otherwise stay at currentIndex to return to where we left off
      } else {
        // Still have skipped cards - stay in cycling mode
        if (isCurrentCard) {
          // Current card was correct - stay in cycle mode with remaining skipped cards
          setCycleIndex(0);
        } else {
          // Was a skipped card - exit cycling and return to current card
          setCyclingMode(false);
          setCycleIndex(0);
        }
      }
    } else {
      moveToNext();
    }
  };

  const handleSkip = () => {
    if (!canSkip && !cyclingMode) {
      // Skip limit reached - add current card to skipped pool (if not already there) and enter cycling mode
      if (!skippedCards.includes(currentIndex)) {
        setSkippedCards([...skippedCards, currentIndex]);
      }
      setCyclingMode(true);
      setCycleIndex(0);
    } else if (cyclingMode) {
      // Already in cycling mode - just move to next skipped card
      const nextIndex = (cycleIndex + 1) % skippedCards.length;
      setCycleIndex(nextIndex);
    } else {
      // Normal skip
      setSkippedCount(skippedCount + 1);
      if (!skippedCards.includes(currentIndex)) {
        setSkippedCards([...skippedCards, currentIndex]);
      }
      moveToNext();
    }
  };

  const moveToNext = () => {
    // Find next unvisited card
    let nextIndex = currentIndex + 1;
    while (nextIndex < totalWords && visitedCards.includes(nextIndex)) {
      nextIndex++;
    }

    if (nextIndex < totalWords) {
      setCurrentIndex(nextIndex);
      setVisitedCards([...visitedCards, nextIndex]);
    } else {
      // No more unvisited cards
      if (skippedCards.length > 0 && !cyclingMode) {
        // Still have skipped cards - enter cycling mode
        setCyclingMode(true);
        setCycleIndex(0);
      } else {
        setGameEnded(true);
      }
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
          <div className="header-stats">
            <div className="score-display-inline">
              <div className="score-item-inline">
                <span className="score-label">Correct:</span>
                <span className="score-value correct">{correctCount}</span>
              </div>
              <div className="score-item-inline">
                <span className="score-label">Skipped:</span>
                <span className="score-value skipped">{skippedCount}</span>
              </div>
            </div>
            {timeLimit !== null && (
              <div className={`timer ${timeRemaining <= 10 ? 'timer-warning' : ''}`}>
                {formatTime(timeRemaining)}
              </div>
            )}
            {maxSkips !== null && (
              <div className={`skips-counter ${skipsRemaining === 0 ? 'skips-depleted' : ''}`}>
                Skips: {skipsRemaining}
              </div>
            )}
          </div>
        </div>
      </div>

      {cyclingMode && (
        <div className="cycling-banner">
          <div className="cycling-icon">🔄</div>
          <div className="cycling-text">
            <strong>Reviewing Skipped Cards</strong>
            <span>Card {safeCycleIndex + 1} of {skippedCards.length} skipped cards</span>
          </div>
        </div>
      )}

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
          <button
            className="game-button skip-button"
            onClick={handleSkip}
            disabled={!canSkip && !cyclingMode && skippedCards.length === 0}
            title={cyclingMode ? 'Cycle to next skipped card' : (!canSkip && skippedCards.length > 0 ? 'Click to review skipped cards' : '')}
          >
            {cyclingMode ? 'Next Skipped Card' : (!canSkip && skippedCards.length > 0 ? 'Review Skipped' : 'Skip')}
          </button>
          <button className="game-button correct-button" onClick={handleCorrect}>
            Correct
          </button>
        </div>
      </div>

      <div className="score-display desktop-only">
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
