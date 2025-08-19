'use client';

import { LoadingState } from '@/types';
import { Loader2, Camera, Globe, Brain, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  loadingState: LoadingState;
}

export default function LoadingStateComponent({ loadingState }: LoadingStateProps) {
  const steps = [
    { key: 'scraping', label: 'Analyzing website content...', icon: Globe },
    { key: 'screenshot', label: 'Taking screenshot...', icon: Camera },
    { key: 'analysis', label: 'Generating personality...', icon: Brain },
    { key: 'complete', label: 'Finalizing results...', icon: Sparkles },
  ];

  const currentStepIndex = steps.findIndex(step => 
    loadingState.currentStep.toLowerCase().includes(step.key)
  );

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-6 animate-fade-in">
      <div className="relative">
        {/* Progress Circle */}
        <div className="w-24 h-24 mx-auto relative">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - loadingState.progress / 100)}`}
              className="text-primary-500 transition-all duration-500 ease-out"
              strokeLinecap="round"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
          </div>
        </div>
      </div>

      {/* Current step */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {loadingState.currentStep}
        </h3>
        <p className="text-sm text-gray-600">
          This usually takes 10-15 seconds
        </p>
      </div>

      {/* Progress steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          
          return (
            <div
              key={step.key}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-primary-50 border border-primary-200' 
                  : isCompleted 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isActive 
                  ? 'bg-primary-500 text-white' 
                  : isCompleted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                isActive 
                  ? 'text-primary-700' 
                  : isCompleted 
                    ? 'text-green-700' 
                    : 'text-gray-500'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-500 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${loadingState.progress}%` }}
        />
      </div>
    </div>
  );
}
