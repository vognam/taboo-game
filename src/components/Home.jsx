import { useState } from 'react';
import './Home.css';

function Home({ onStartGame }) {
  const [category, setCategory] = useState('general');
  const [difficulty, setDifficulty] = useState('medium');
  const [timeLimit, setTimeLimit] = useState(null); // null = infinite
  const [wordCount, setWordCount] = useState(20);
  const [tabooWordCount, setTabooWordCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartGame = async () => {
    if (!category.trim()) {
      setError('Please enter a category');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onStartGame(category.trim(), difficulty, wordCount, timeLimit, tabooWordCount);
    } catch (err) {
      setError(err.message || 'Failed to start game. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h1 className="home-title">Taboo Game</h1>
        <p className="home-subtitle">
          Test your word skills! Describe the word without using the taboo words.
        </p>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., movies, sports, technology"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Difficulty</label>
          <div className="difficulty-buttons">
            <button
              className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
              onClick={() => setDifficulty('easy')}
              disabled={loading}
            >
              Easy
            </button>
            <button
              className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
              onClick={() => setDifficulty('medium')}
              disabled={loading}
            >
              Medium
            </button>
            <button
              className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => setDifficulty('hard')}
              disabled={loading}
            >
              Hard
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Time Limit</label>
          <div className="time-limit-buttons">
            <button
              className={`time-limit-btn ${timeLimit === 15 ? 'active' : ''}`}
              onClick={() => setTimeLimit(15)}
              disabled={loading}
            >
              15s
            </button>
            <button
              className={`time-limit-btn ${timeLimit === 30 ? 'active' : ''}`}
              onClick={() => setTimeLimit(30)}
              disabled={loading}
            >
              30s
            </button>
            <button
              className={`time-limit-btn ${timeLimit === 60 ? 'active' : ''}`}
              onClick={() => setTimeLimit(60)}
              disabled={loading}
            >
              1m
            </button>
            <button
              className={`time-limit-btn ${timeLimit === 120 ? 'active' : ''}`}
              onClick={() => setTimeLimit(120)}
              disabled={loading}
            >
              2m
            </button>
            <button
              className={`time-limit-btn ${timeLimit === null ? 'active' : ''}`}
              onClick={() => setTimeLimit(null)}
              disabled={loading}
            >
              ∞
            </button>
          </div>
        </div>

        <details className="advanced-options">
          <summary>Advanced Options</summary>
          <div className="advanced-content">
            <div className="form-group">
              <label>Number of Words</label>
              <div className="word-count-buttons">
                <button
                  className={`word-count-btn ${wordCount === 5 ? 'active' : ''}`}
                  onClick={() => setWordCount(5)}
                  disabled={loading}
                >
                  5
                </button>
                <button
                  className={`word-count-btn ${wordCount === 10 ? 'active' : ''}`}
                  onClick={() => setWordCount(10)}
                  disabled={loading}
                >
                  10
                </button>
                <button
                  className={`word-count-btn ${wordCount === 15 ? 'active' : ''}`}
                  onClick={() => setWordCount(15)}
                  disabled={loading}
                >
                  15
                </button>
                <button
                  className={`word-count-btn ${wordCount === 20 ? 'active' : ''}`}
                  onClick={() => setWordCount(20)}
                  disabled={loading}
                >
                  20
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>
                Number of Taboo Words: <span className="slider-value">{tabooWordCount}</span>
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={tabooWordCount}
                onChange={(e) => setTabooWordCount(Number(e.target.value))}
                className="taboo-slider"
                disabled={loading}
              />
              <div className="slider-labels">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </details>

        {error && <div className="error-message">{error}</div>}

        <button
          className="start-button"
          onClick={handleStartGame}
          disabled={loading}
        >
          {loading ? 'Generating Words...' : 'Start Game'}
        </button>

        <div className="info-box">
          <p>
            <strong>How to play:</strong> You'll see {wordCount} cards with a word and {tabooWordCount} taboo word{tabooWordCount !== 1 ? 's' : ''}.
            Describe the main word to your team without saying any of the taboo words!
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
