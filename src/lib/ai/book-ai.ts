interface BookAIInput {
  title: string;
  author: string;
  description?: string;
  genre: string;
  publishedYear: number;
}

interface BookAIOutput {
  aiSummary: string;
  recommendedGenres: string[];
}

export async function generateBookAI(book: BookAIInput): Promise<BookAIOutput> {
  const provider = process.env.AI_PROVIDER || 'openai';

  if (provider === 'claude') {
    return generateWithClaude(book);
  } else {
    return generateWithOpenAI(book);
  }
}

async function generateWithOpenAI(book: BookAIInput): Promise<BookAIOutput> {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenAI API key not configured, skipping AI generation');
    return {
      aiSummary: '',
      recommendedGenres: [],
    };
  }

  try {
    const prompt = `Given this book information:
Title: ${book.title}
Author: ${book.author}
Genre: ${book.genre}
Published: ${book.publishedYear}
${book.description ? `Description: ${book.description}` : ''}

Generate:
1. A concise 2-3 sentence summary of what this book is likely about
2. Exactly 3 related genres that readers of this book might also enjoy

Respond in JSON format:
{
  "summary": "your summary here",
  "genres": ["genre1", "genre2", "genre3"]
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful librarian assistant that generates book summaries and genre recommendations.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No content in OpenAI response');
    }

    const parsed = JSON.parse(content);

    return {
      aiSummary: parsed.summary || '',
      recommendedGenres: parsed.genres || [],
    };
  } catch (error) {
    console.error('Error generating AI content with OpenAI:', error);
    return {
      aiSummary: '',
      recommendedGenres: [],
    };
  }
}

async function generateWithClaude(book: BookAIInput): Promise<BookAIOutput> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    console.warn('Anthropic API key not configured, skipping AI generation');
    return {
      aiSummary: '',
      recommendedGenres: [],
    };
  }

  try {
    const prompt = `Given this book information:
Title: ${book.title}
Author: ${book.author}
Genre: ${book.genre}
Published: ${book.publishedYear}
${book.description ? `Description: ${book.description}` : ''}

Generate:
1. A concise 2-3 sentence summary of what this book is likely about
2. Exactly 3 related genres that readers of this book might also enjoy

Respond in JSON format:
{
  "summary": "your summary here",
  "genres": ["genre1", "genre2", "genre3"]
}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Claude API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.content[0]?.text;

    if (!content) {
      throw new Error('No content in Claude response');
    }

    const parsed = JSON.parse(content);

    return {
      aiSummary: parsed.summary || '',
      recommendedGenres: parsed.genres || [],
    };
  } catch (error) {
    console.error('Error generating AI content with Claude:', error);
    return {
      aiSummary: '',
      recommendedGenres: [],
    };
  }
}
