'use client';

import { PersonalityAnalysis } from '@/types';
import { Music, Users, Quote, Star, RefreshCw } from 'lucide-react';

interface PersonalityCardProps {
  analysis: PersonalityAnalysis;
  onAnalyzeAnother: () => void;
}

export default function PersonalityCard({ analysis, onAnalyzeAnother }: PersonalityCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 8) return 'bg-green-100';
    if (score >= 6) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Personality Card */}
      <div className="bg-gradient-to-br from-primary-50 via-white to-accent-50 border border-gray-200 rounded-2xl p-8 shadow-xl staggered-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
            {analysis.personalityType}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-primary-500 to-accent-500 mx-auto rounded-full"></div>
        </div>

        {/* Vibe Description */}
        <div className="mb-8">
          <p className="text-lg text-gray-700 leading-relaxed text-center italic">
            "{analysis.vibeDescription}"
          </p>
        </div>

        {/* Brand Essence */}
        <div className="bg-gradient-to-r from-primary-100 to-accent-100 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-3">
            <Quote className="h-6 w-6 text-primary-600" />
            <p className="text-xl font-semibold text-gray-800 text-center">
              {analysis.brandEssence}
            </p>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreBgColor(analysis.scores.trustReliability)} mb-3`}>
              <Star className={`h-8 w-8 ${getScoreColor(analysis.scores.trustReliability)}`} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Trust & Reliability</h3>
            <div className="text-2xl font-bold text-gray-900">{analysis.scores.trustReliability}/10</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  analysis.scores.trustReliability >= 8 ? 'bg-green-500' :
                  analysis.scores.trustReliability >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${analysis.scores.trustReliability * 10}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreBgColor(analysis.scores.creativityInnovation)} mb-3`}>
              <Star className={`h-8 w-8 ${getScoreColor(analysis.scores.creativityInnovation)}`} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Creativity & Innovation</h3>
            <div className="text-2xl font-bold text-gray-900">{analysis.scores.creativityInnovation}/10</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  analysis.scores.creativityInnovation >= 8 ? 'bg-green-500' :
                  analysis.scores.creativityInnovation >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${analysis.scores.creativityInnovation * 10}%` }}
              />
            </div>
          </div>

          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreBgColor(analysis.scores.professionalism)} mb-3`}>
              <Star className={`h-8 w-8 ${getScoreColor(analysis.scores.professionalism)}`} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Professionalism</h3>
            <div className="text-2xl font-bold text-gray-900">{analysis.scores.professionalism}/10</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  analysis.scores.professionalism >= 8 ? 'bg-green-500' :
                  analysis.scores.professionalism >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${analysis.scores.professionalism * 10}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Target Customer Card */}
      <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-300 rounded-xl p-6 staggered-fade-in delay-100">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
            <Users className="h-5 w-5 text-blue-700" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Perfect For</h2>
        </div>
        <p className="text-gray-700 leading-relaxed">
          {analysis.targetCustomer}
        </p>
      </div>

      {/* Music Playlist Card */}
      <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200 rounded-xl p-6 staggered-fade-in delay-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <Music className="h-5 w-5 text-purple-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Brand Vibe Playlist</h2>
        </div>
        <div className="space-y-2">
          {analysis.musicPlaylist.map((song, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-purple-100">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-purple-600">{index + 1}</span>
              </div>
              <span className="text-gray-700">{song}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Analyze Another Button */}
      <div className="text-center pt-6 staggered-fade-in delay-300">
        <button
          onClick={onAnalyzeAnother}
          className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <RefreshCw className="h-5 w-5" />
          <span>Analyze Another Store</span>
        </button>
      </div>
    </div>
  );
}
