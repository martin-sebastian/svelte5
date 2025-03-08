import { json } from '@sveltejs/kit';
import OpenAI from 'openai';
import { OPENAI_API_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { prompt } = await request.json();
    
    if (!OPENAI_API_KEY) {
      return json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }
    
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    });
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    
    return json({ result: response.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return json({ error: 'Failed to generate content' }, { status: 500 });
  }
}; 