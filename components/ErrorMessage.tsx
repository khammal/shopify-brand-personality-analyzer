'use client';

import { ErrorState } from '@/types';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  error: ErrorState;
  onRetry?: () => void;
}

export default function ErrorMessage({ error, onRetry }: ErrorMessageProps) {
  if (!error.hasError) return null;

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-red-800">
            Oops! Something went wrong
          </h3>
          <p className="text-sm text-red-600">
            {error.message}
          </p>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}
        
        <div className="text-xs text-red-500">
          <p>Common issues:</p>
          <ul className="mt-1 space-y-1">
            <li>• Make sure the URL is a valid website</li>
            <li>• Check if the website is accessible</li>
            <li>• Try again in a few moments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
