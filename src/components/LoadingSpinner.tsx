import React from 'react';
import { Activity } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-full mb-4">
          <Activity className="h-8 w-8 text-white animate-pulse" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">LabAnalyzer</h2>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}