import { useState } from 'react';
import { PersonalityAnalysis, LoadingState, ErrorState } from '@/types';
import URLInput from '@/components/URLInput';
import LoadingStateComponent from '@/components/LoadingState';
import ErrorMessage from '@/components/ErrorMessage';
import PersonalityCard from '@/components/PersonalityCard';
import { Sparkles, Heart, Zap, Store } from 'lucide-react';

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isAnalyzing: false,
    currentStep: '',
    progress: 0,
  });
  const [error, setError] = useState<ErrorState>({
    hasError: false,
    message: '',
  });
  const [analysis, setAnalysis] = useState<PersonalityAnalysis | null>(null);

  const updateLoadingState = (step: string, progress: number) => {
    setLoadingState({
      isAnalyzing: true,
      currentStep: step,
      progress,
    });
  };

  const handleAnalyze = async (url: string) => {
    setLoading(true);
    setError({ hasError: false, message: '' });
    setAnalysis(null);

    try {
      // Step 1: Scraping website content
      updateLoadingState('Analyzing website content...', 25);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 2: Taking screenshot
      updateLoadingState('Taking screenshot...', 50);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 3: Generating personality analysis
      updateLoadingState('Generating personality analysis...', 75);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Finalizing results
      updateLoadingState('Finalizing results...', 100);
      await new Promise(resolve => setTimeout(resolve, 500));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to analyze store');
      }

      if (result.success && result.data) {
        setAnalysis(result.data);
      } else {
        throw new Error('Invalid response from server');
      }

    } catch (error) {
      console.error('Analysis error:', error);
      setError({
        hasError: true,
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
      });
    } finally {
      setLoading(false);
      setLoadingState({
        isAnalyzing: false,
        currentStep: '',
        progress: 0,
      });
    }
  };

  const handleRetry = () => {
    setError({ hasError: false, message: '' });
  };

  const handleAnalyzeAnother = () => {
    setAnalysis(null);
    setError({ hasError: false, message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
          <Store className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold gradient-text">
          Brandify
          </h1>
        </div>
        </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!analysis && !loading && !error.hasError && (
          <div className="text-center space-y-8">
            {/* Hero Section */}
            <div className="space-y-6 fade-in-up">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">
                  Discover Your Shopify Store's
                  <br />
                  <span className="text-accent-900">Personality</span> in Seconds
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Get instant, AI-powered insights into any website's unique character. 
                  From vibe descriptions to target customers, discover what makes any brand special.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 staggered-fade-in delay-100">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Lightning Fast</h3>
                  <p className="text-gray-600">Get your analysis in under 15 seconds</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 staggered-fade-in delay-200">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-accent-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Powered</h3>
                  <p className="text-gray-600">Advanced AI analyzes your brand's unique traits</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 staggered-fade-in delay-300">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Insightful</h3>
                  <p className="text-gray-600">Discover your target audience and brand essence</p>
                </div>
              </div>
            </div>

            {/* URL Input */}
            <div className="mt-16 staggered-fade-in delay-400">
              <URLInput onAnalyze={handleAnalyze} loading={loading} />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center space-y-8">
            <LoadingStateComponent loadingState={loadingState} />
          </div>
        )}

        {/* Error State */}
        {error.hasError && (
          <div className="text-center space-y-8">
            <ErrorMessage error={error} onRetry={handleRetry} />
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-8">
            <PersonalityCard 
              analysis={analysis} 
              onAnalyzeAnother={handleAnalyzeAnother} 
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Made for Shopify store owners
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
