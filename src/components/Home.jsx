import { useState, useEffect } from 'react';
import './Home.css';

// Helper functions for localStorage
const getStoredValue = (key, defaultValue) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const setStoredValue = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
  }
};

function Home({ onStartGame }) {
  const [category, setCategory] = useState(() => getStoredValue('taboo_category', 'general'));
  const [difficulty, setDifficulty] = useState(() => getStoredValue('taboo_difficulty', 'medium'));
  const [timeLimit, setTimeLimit] = useState(() => getStoredValue('taboo_timeLimit', null));
  const [wordCount, setWordCount] = useState(() => getStoredValue('taboo_wordCount', 20));
  const [tabooWordCount, setTabooWordCount] = useState(() => getStoredValue('taboo_tabooWordCount', 5));
  const [maxSkips, setMaxSkips] = useState(() => getStoredValue('taboo_maxSkips', null));
  const [devMode, setDevMode] = useState(() => getStoredValue('taboo_devMode', false));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  // Save settings to localStorage whenever they change
  useEffect(() => {
    setStoredValue('taboo_category', category);
  }, [category]);

  useEffect(() => {
    setStoredValue('taboo_difficulty', difficulty);
  }, [difficulty]);

  useEffect(() => {
    setStoredValue('taboo_timeLimit', timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    setStoredValue('taboo_wordCount', wordCount);
  }, [wordCount]);

  useEffect(() => {
    setStoredValue('taboo_tabooWordCount', tabooWordCount);
  }, [tabooWordCount]);

  useEffect(() => {
    setStoredValue('taboo_maxSkips', maxSkips);
  }, [maxSkips]);

  useEffect(() => {
    setStoredValue('taboo_devMode', devMode);
  }, [devMode]);

  const handleStartGame = async () => {
    if (!devMode && !category.trim()) {
      setError('Please enter a category');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await onStartGame(category.trim(), difficulty, wordCount, timeLimit, tabooWordCount, maxSkips, devMode);
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

        {isLocalhost && (
          <div className="dev-mode-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={devMode}
                onChange={(e) => setDevMode(e.target.checked)}
                className="toggle-checkbox"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">Dev Mode (Use Mock Data)</span>
            </label>
          </div>
        )}

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

            <div className="form-group">
              <label>Max Skips Allowed</label>
              <div className="max-skips-buttons">
                <button
                  className={`max-skips-btn ${maxSkips === 0 ? 'active' : ''}`}
                  onClick={() => setMaxSkips(0)}
                  disabled={loading}
                >
                  0
                </button>
                <button
                  className={`max-skips-btn ${maxSkips === 1 ? 'active' : ''}`}
                  onClick={() => setMaxSkips(1)}
                  disabled={loading}
                >
                  1
                </button>
                <button
                  className={`max-skips-btn ${maxSkips === 2 ? 'active' : ''}`}
                  onClick={() => setMaxSkips(2)}
                  disabled={loading}
                >
                  2
                </button>
                <button
                  className={`max-skips-btn ${maxSkips === 3 ? 'active' : ''}`}
                  onClick={() => setMaxSkips(3)}
                  disabled={loading}
                >
                  3
                </button>
                <button
                  className={`max-skips-btn ${maxSkips === 5 ? 'active' : ''}`}
                  onClick={() => setMaxSkips(5)}
                  disabled={loading}
                >
                  5
                </button>
                <button
                  className={`max-skips-btn ${maxSkips === null ? 'active' : ''}`}
                  onClick={() => setMaxSkips(null)}
                  disabled={loading}
                >
                  ∞
                </button>
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
