import type { NextApiRequest, NextApiResponse } from 'next';
import { scrapeWebsite } from '@/lib/scraper';
import { captureScreenshot } from '@/lib/screenshot';
import { generatePersonalityAnalysis } from '@/lib/openai';
import { validateShopifyUrl } from '@/lib/scraper';

const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 5; // 5 requests per minute

  const userData = rateLimit.get(ip);
  
  if (!userData || now > userData.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userData.count >= maxRequests) {
    return false;
  }

  userData.count++;
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Apply rate limiting
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    
    if (!checkRateLimit(ip as string)) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }

    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Basic Shopify validation
    if (!validateShopifyUrl(url)) {
      return res.status(400).json({ error: 'Please enter a valid Shopify store URL' });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    // Scrape website content
    const scrapedData = await scrapeWebsite(url);

    // Generate personality analysis
    const analysis = await generatePersonalityAnalysis(scrapedData);

    // Note: Screenshot capture is commented out for now to avoid external API dependencies
    // const screenshot = await captureScreenshot(url);

    return res.status(200).json({
      success: true,
      data: analysis,
      scrapedData: {
        url: scrapedData.url,
        title: scrapedData.title,
        headline: scrapedData.headline,
      },
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    let errorMessage = 'An unexpected error occurred';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Failed to scrape website')) {
        errorMessage = 'Unable to access the website. Please check if the URL is correct and the site is accessible.';
        statusCode = 400;
      } else if (error.message.includes('Failed to generate personality analysis')) {
        errorMessage = 'Unable to generate personality analysis. Please try again.';
        statusCode = 500;
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timed out. Please try again.';
        statusCode = 408;
      } else {
        errorMessage = error.message;
      }
    }

    return res.status(statusCode).json({ error: errorMessage });
  }
}
