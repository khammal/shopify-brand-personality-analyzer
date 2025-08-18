import { Configuration, OpenAIApi } from 'openai';
import { ScrapedData, PersonalityAnalysis } from '@/types';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generatePersonalityAnalysis(scrapedData: ScrapedData): Promise<PersonalityAnalysis> {
  try {
    const prompt = createAnalysisPrompt(scrapedData);
    
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a creative brand personality analyst who creates fun, insightful, and unique personality assessments for e-commerce stores. Always be entertaining but professional. Generate unique personality types that are never hardcoded or repeated."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const response = completion.data.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    return parseAnalysisResponse(response);
  } catch (error) {
    console.error('Error generating personality analysis:', error);
    throw new Error('Failed to generate personality analysis');
  }
}

function createAnalysisPrompt(scrapedData: ScrapedData): string {
  return `Analyze this e-commerce store and create a fun personality assessment:

Store URL: ${scrapedData.url}
Page Title: ${scrapedData.title}
Main Headline: ${scrapedData.headline}
Visible Text Sample: ${scrapedData.textSample}
Meta Description: ${scrapedData.metaDescription}

Create a personality analysis with the following structure (respond in JSON format):

{
  "personalityType": "A creative personality type name (e.g., 'The Cozy Minimalist', 'Digital Maverick', 'Artisan Dreamer'). Make this unique and creative.",
  "vibeDescription": "A fun 'vibe' description in a paragraph. Start with a relatable comparison (e.g., 'Feels like a trendy coffee shop that also sells handmade ceramics'). Be entertaining but insightful.",
  "targetCustomer": "Description of who would love shopping here (be specific and relatable)",
  "musicPlaylist": ["Song 1 - Artist 1", "Song 2 - Artist 2", "Song 3 - Artist 3", "Song 4 - Artist 4", "Song 5 - Artist 5"],
  "brandEssence": "One-line summary of the brand essence (be catchy and memorable)",
  "scores": {
    "trustReliability": 8,
    "creativityInnovation": 7,
    "professionalism": 9
  }
}

Be entertaining but insightful. Focus on what makes this brand unique. Rate scores on a scale of 1-10.`;
}

function parseAnalysisResponse(response: string): PersonalityAnalysis {
  try {
    // Try to extract JSON from the response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      
      // Validate the structure
      if (parsed.personalityType && parsed.vibeDescription && parsed.targetCustomer && 
          parsed.musicPlaylist && parsed.brandEssence && parsed.scores) {
        return {
          personalityType: parsed.personalityType,
          vibeDescription: parsed.vibeDescription,
          targetCustomer: parsed.targetCustomer,
          musicPlaylist: Array.isArray(parsed.musicPlaylist) ? parsed.musicPlaylist : [],
          brandEssence: parsed.brandEssence,
          scores: {
            trustReliability: Math.min(10, Math.max(1, parsed.scores.trustReliability || 5)),
            creativityInnovation: Math.min(10, Math.max(1, parsed.scores.creativityInnovation || 5)),
            professionalism: Math.min(10, Math.max(1, parsed.scores.professionalism || 5)),
          },
        };
      }
    }
    
    // Fallback parsing if JSON extraction fails
    return parseFallbackResponse(response);
  } catch (error) {
    console.error('Error parsing analysis response:', error);
    return parseFallbackResponse(response);
  }
}

function parseFallbackResponse(response: string): PersonalityAnalysis {
  // Fallback parsing for when JSON parsing fails
  const lines = response.split('\n').filter(line => line.trim());
  
  return {
    personalityType: extractValue(lines, 'personalityType') || 'The Mysterious Merchant',
    vibeDescription: extractValue(lines, 'vibeDescription') || 'This store has a unique personality that\'s hard to pin down, but definitely worth exploring!',
    targetCustomer: extractValue(lines, 'targetCustomer') || 'Adventurous shoppers looking for something different',
    musicPlaylist: extractPlaylist(lines) || ['Unknown Artist - Unknown Song'],
    brandEssence: extractValue(lines, 'brandEssence') || 'A brand with character and charm',
    scores: {
      trustReliability: 7,
      creativityInnovation: 8,
      professionalism: 6,
    },
  };
}

function extractValue(lines: string[], key: string): string | null {
  for (const line of lines) {
    if (line.toLowerCase().includes(key.toLowerCase())) {
      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        return line.substring(colonIndex + 1).trim().replace(/['"]/g, '');
      }
    }
  }
  return null;
}

function extractPlaylist(lines: string[]): string[] {
  const playlist: string[] = [];
  for (const line of lines) {
    if (line.includes('-') && (line.includes('Song') || line.includes('Artist'))) {
      playlist.push(line.trim().replace(/['"]/g, ''));
    }
  }
  return playlist.length > 0 ? playlist : ['Unknown Artist - Unknown Song'];
}
