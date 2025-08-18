'use client';

import { useState } from 'react';
import { URLInputProps } from '@/types';
import { Search, Loader2 } from 'lucide-react';

export default function URLInput({ onAnalyze, loading }: URLInputProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (inputUrl: string): boolean => {
    try {
      let normalizedUrl = inputUrl.trim();
      
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      
      new URL(normalizedUrl);
      
      return true;
      
      setError('');
      return true;
    } catch {
      setError('Please enter a valid URL');
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loading) return;
    
    if (validateUrl(url)) {
      let normalizedUrl = url.trim();
      if (!normalizedUrl.startsWith('http://') && !normalizedUrl.startsWith('https://')) {
        normalizedUrl = 'https://' + normalizedUrl;
      }
      onAnalyze(normalizedUrl);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={url}
            onChange={handleInputChange}
            placeholder="Enter your store URL (e.g., yourstore.com)"
            className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
              error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-100' 
                : 'border-gray-200 focus:border-primary-500 focus:ring-primary-100'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          />
        </div>
        
        {error && (
          <div className="text-red-500 text-sm font-medium animate-fade-in">
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className={`w-full py-4 px-8 text-lg font-semibold text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
            loading || !url.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Analyze My Store</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
