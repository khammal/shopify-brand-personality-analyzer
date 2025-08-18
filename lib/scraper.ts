import * as cheerio from 'cheerio';
import axios from 'axios';
import { ScrapedData } from '@/types';

export async function scrapeWebsite(url: string): Promise<ScrapedData> {
  try {
    const normalizedUrl = normalizeUrl(url);
    
    // Fetch the webpage
    const response = await axios.get(normalizedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      timeout: 10000,
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract basic information
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'Untitled';
    const metaDescription = $('meta[name="description"]').attr('content') || '';
    
    // Extract main headline (prioritize h1, then h2, then other headings)
    let headline = $('h1').first().text().trim();
    if (!headline) {
      headline = $('h2').first().text().trim();
    }
    if (!headline) {
      headline = $('h3').first().text().trim();
    }
    if (!headline) {
      headline = title;
    }

    // Extract visible text content (first 500 characters)
    const visibleText = $('body')
      .find('p, h1, h2, h3, h4, h5, h6, span, div')
      .map((_, el) => $(el).text().trim())
      .get()
      .filter(text => text.length > 10)
      .slice(0, 10)
      .join(' ')
      .substring(0, 500);

    // Extract dominant colors from CSS (simplified approach)
    const dominantColors = extractColorsFromCSS($ as any);

    return {
      url: normalizedUrl,
      title,
      headline,
      textSample: visibleText,
      metaDescription,
      dominantColors,
    };
  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Failed to scrape website content');
  }
}

function normalizeUrl(url: string): string {
  let normalized = url.trim();
  
  // Add protocol if missing
  if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
    normalized = 'https://' + normalized;
  }
  
  // Ensure it's a valid URL
  try {
    new URL(normalized);
    return normalized;
  } catch {
    throw new Error('Invalid URL format');
  }
}

function extractColorsFromCSS($: cheerio.CheerioAPI): string[] {
  const colors: string[] = [];
  
  // Extract colors from style attributes and CSS
  $('[style*="color"], [style*="background"]').each((_, el) => {
    const style = $(el).attr('style');
    if (style) {
      const colorMatches = style.match(/#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)/g);
      if (colorMatches) {
        colors.push(...colorMatches);
      }
    }
  });

  // Extract from CSS classes (simplified)
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href) {}
  });

  // Return unique colors, limited to 5
  return Array.from(new Set(colors)).slice(0, 5);
}

export function validateShopifyUrl(url: string): boolean {
  try {
    let normalizedUrl = url.trim();
    
    if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
      normalizedUrl = 'https://' + normalizedUrl;
    }
    
    new URL(normalizedUrl);
    
    return true;
  } catch {
    return false;
  }
}
