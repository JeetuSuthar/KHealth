import React, { useState } from 'react';
import { LogOut, Upload, FileText, TrendingUp, User, Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from './FileUpload';
import ReportsTable from './ReportsTable';
import TrendsChart from './TrendsChart';
import { LabReport } from '../../shared/types';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'reports' | 'trends'>('upload');
  const [reports, setReports] = useState<LabReport[]>([]);

  const handleReportUploaded = (newReport: LabReport) => {
    setReports(prev => [newReport, ...prev]);
    setActiveTab('reports');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">LabAnalyzer</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Upload className="h-5 w-5 inline-block mr-2" />
              Upload Report
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'reports'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-5 w-5 inline-block mr-2" />
              My Reports
              {reports.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {reports.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('trends')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'trends'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="h-5 w-5 inline-block mr-2" />
              Health Trends
            </button>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'upload' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Lab Report</h2>
              <p className="mt-1 text-sm text-gray-600">
                Upload your lab report (PDF or image) and get instant health insights
              </p>
            </div>
            <FileUpload onReportUploaded={handleReportUploaded} />
          </div>
        )}

        {activeTab === 'reports' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Reports</h2>
              <p className="mt-1 text-sm text-gray-600">
                View and analyze your uploaded lab reports
              </p>
            </div>
            <ReportsTable reports={reports} setReports={setReports} />
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Health Trends</h2>
              <p className="mt-1 text-sm text-gray-600">
                Track your health parameters over time
              </p>
            </div>
            <TrendsChart reports={reports} />
          </div>
        )}
      </main>
    </div>
  );
}