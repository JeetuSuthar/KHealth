"use client"

import { useState } from "react"
import { LogOut, Upload, FileText, TrendingUp, User, Activity } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import FileUpload from "./FileUpload"
import ReportsTable from "./ReportsTable"
import TrendsChart from "./TrendsChart"
import type { LabReport } from "../../shared/types"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState<"upload" | "reports" | "trends">("upload")
  const [reports, setReports] = useState<LabReport[]>([])

  const handleReportUploaded = (newReport: LabReport) => {
    setReports((prev) => [newReport, ...prev])
    setActiveTab("reports")
  }

  const handleDeleteReport = (reportId: string) => {
    setReports((prev) => prev.filter((report) => report._id !== reportId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">
            <div className="flex items-center space-x-3">
              <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">Korai Health</h1>
                <p className="text-xs text-gray-500 hidden sm:block">Lab Report Analyzer</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <User className="h-4 w-4" />
                <span className="font-medium">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-1">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 sm:flex-none py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === "upload"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Upload className="h-4 w-4 inline-block mr-2" />
              <span className="hidden sm:inline">Upload</span>
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`flex-1 sm:flex-none py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 relative ${
                activeTab === "reports"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <FileText className="h-4 w-4 inline-block mr-2" />
              <span className="hidden sm:inline">Reports</span>
              {reports.length > 0 && (
                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-white/20 text-current">
                  {reports.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("trends")}
              className={`flex-1 sm:flex-none py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                activeTab === "trends"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <TrendingUp className="h-4 w-4 inline-block mr-2" />
              <span className="hidden sm:inline">Trends</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === "upload" && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Upload Lab Report</h2>
              <p className="text-sm sm:text-base text-gray-600">
                Upload your lab report (PDF or image) and get instant health insights
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
              <FileUpload onReportUploaded={handleReportUploaded} />
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="text-center sm:text-left mb-4 sm:mb-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">My Reports</h2>
                <p className="text-sm sm:text-base text-gray-600">View and analyze your uploaded lab reports</p>
              </div>
              {reports.length > 0 && (
                <div className="text-center sm:text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800">
                    {reports.length} {reports.length === 1 ? "Report" : "Reports"}
                  </span>
                </div>
              )}
            </div>

            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 sm:p-12 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reports yet</h3>
                <p className="text-gray-600 mb-6">Upload your first lab report to get started</p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Report
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                <ReportsTable reports={reports} setReports={setReports} onDeleteReport={handleDeleteReport} />
              </div>
            )}
          </div>
        )}

        {activeTab === "trends" && (
          <div className="space-y-6">
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Health Trends</h2>
              <p className="text-sm sm:text-base text-gray-600">Track your health parameters over time</p>
            </div>

            {reports.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 p-8 sm:p-12 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No data to show trends</h3>
                <p className="text-gray-600 mb-6">Upload at least one lab report to see your health trends</p>
                <button
                  onClick={() => setActiveTab("upload")}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg hover:from-emerald-600 hover:to-teal-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Report
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                <TrendsChart reports={reports} />
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
