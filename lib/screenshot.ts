import axios from 'axios';

export async function captureScreenshot(url: string): Promise<string> {
  try {
    // Using htmlcsstojs.com screenshot API
    const screenshotUrl = `https://htmlcsstojs.com/api/screenshot?url=${encodeURIComponent(url)}&width=1200&height=800&format=png`;
    
    const response = await axios.get(screenshotUrl, {
      timeout: 15000,
      responseType: 'arraybuffer',
    });

    // Convert to base64 for storage/transmission
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    
    throw new Error('Failed to capture screenshot');
  }
}

// Alternative implementation using a different screenshot service
export async function captureScreenshotAlternative(url: string): Promise<string> {
  try {
    // Using a different screenshot service as fallback
    const apiKey = process.env.SCREENSHOT_API_KEY; // Optional API key for premium services
    
    const response = await axios.post('https://api.screenshotone.com/take', {
      url: url,
      viewport_width: 1200,
      viewport_height: 800,
      format: 'png',
      quality: 90,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
      responseType: 'arraybuffer',
    });

    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/png;base64,${base64}`;
  } catch (error) {
    console.error('Error capturing screenshot (alternative):', error);
    throw new Error('Failed to capture screenshot');
  }
}
