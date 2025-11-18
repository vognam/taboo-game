import Anthropic from '@anthropic-ai/sdk';

/**
 * Generates taboo game words using Claude API
 * @param {string} category - The category for generating words (e.g., "general", "movies", "sports")
 * @param {string} difficulty - The difficulty level ("easy", "medium", or "hard")
 * @param {number} wordCount - The number of words to generate (default: 20, max: 20)
 * @param {number} tabooWordCount - The number of taboo words per card (default: 5, range: 0-10)
 * @returns {Promise<Array>} Array of word objects with taboo words
 */
export async function generateTabooWords(category = 'general', difficulty = 'medium', wordCount = 20, tabooWordCount = 5) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not set in environment variables');
  }

  const client = new Anthropic({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true // Note: In production, API calls should be made from a backend
  });

  const difficultyPrompts = {
    easy: 'simple, common words that are well-known',
    medium: 'moderately challenging words with clear but not obvious connections',
    hard: 'extremely challenging words with subtle connections and difficult-to-avoid taboo words. The words should be very niche and not obvious at all'
  };

  const prompt = `Generate ${wordCount} Taboo game cards for the category "${category}" with ${difficulty} difficulty.

For ${difficulty} difficulty, use ${difficultyPrompts[difficulty]}.

Return ONLY a valid JSON array with exactly ${wordCount} objects. Each object must have:
- "word": the main word to guess (string). It can be multiple words (e.g., "Ice Cream").
- "tabooWords": array of exactly ${tabooWordCount} taboo words that cannot be used when describing the main word (array of strings)

${tabooWordCount === 0 ? 'Since there are 0 taboo words, just provide an empty array for tabooWords.' : `Make sure the taboo words are related to the main word but challenging to avoid. The words should be appropriate for the ${difficulty} difficulty level.`}

Example format:
[
  {
    "word": "Ocean",
    "tabooWords": ${tabooWordCount === 0 ? '[]' : `["Water", "Sea", "Blue"${tabooWordCount > 3 ? ', "Fish"' : ''}${tabooWordCount > 4 ? ', "Waves"' : ''}]`}
  },
  {
    "word": "Pizza",
    "tabooWords": ${tabooWordCount === 0 ? '[]' : `["Cheese", "Italy", "Dough"${tabooWordCount > 3 ? ', "Slice"' : ''}${tabooWordCount > 4 ? ', "Pepperoni"' : ''}]`}
  }
]

Return ONLY the JSON array, no other text or explanation.`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-0',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const responseText = message.content[0].text;

    // Parse the JSON response
    const words = JSON.parse(responseText);

    // Validate the response
    if (!Array.isArray(words) || words.length !== wordCount) {
      throw new Error(`Invalid response format: expected array of ${wordCount} words`);
    }

    // Validate each word object
    words.forEach((word, index) => {
      if (!word.word || !Array.isArray(word.tabooWords) || word.tabooWords.length !== tabooWordCount) {
        throw new Error(`Invalid word format at index ${index}: expected ${tabooWordCount} taboo words`);
      }
    });

    return words;
  } catch (error) {
    console.error('Error generating taboo words:', error);
    throw error;
  }
}
