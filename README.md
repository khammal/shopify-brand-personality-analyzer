# Brand Personality Analyzer

A modern, AI-powered web tool that analyzes Shopify stores and generates insightful brand personality assessments based on their store's appearance and content.

## 🛠️ Tech Stack

- **Framework**: Next.js (React) 14+ with TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI GPT-4 API
- **Web Scraping**: Cheerio for HTML parsing

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per minute | No (default: 5) |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window in ms | No (default: 60000) |

### Getting an OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## 🎯 How It Works

1. **URL Input**: User enters a Shopify store URL
4. **AI Analysis**: Generates personality assessment
5. **Results Display**: Results of the analysis are shown

## 🎨 Features in Detail

### Personality Analysis Includes:
- **Personality Type**: Creative, unique personality classification
- **Vibe Description**: Fun, relatable description of the brand's feel
- **Target Customer**: Who would love shopping at this store
- **Music Playlist**: 5-6 song suggestions matching the brand vibe
- **Brand Essence**: One-line summary of the brand's character
- **Scores**: Three ratings (1-10) for Trust/Reliability, Creativity/Innovation, and Professionalism
