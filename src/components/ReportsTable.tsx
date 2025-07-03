import React, { useEffect, useState } from 'react';
import { FileText, Calendar, Download, Eye, AlertTriangle, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { LabReport } from '../../shared/types';
import { reportService } from '../services/reportService';
import { useAuth } from '../contexts/AuthContext';
import ParameterModal from './ParameterModal';
import ReportDownload from './ReportDownload';

interface ReportsTableProps {
  reports: LabReport[];
  setReports: React.Dispatch<React.SetStateAction<LabReport[]>>;
  onDeleteReport: (reportId: string) => void;
}

export default function ReportsTable({ reports, setReports }: ReportsTableProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
  }, [user]);

  const fetchReports = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { reports: fetchedReports, error } = await reportService.getUserReports(user._id);
      if (error) {
        toast.error(error);
      } else {
        setReports(fetchedReports);
      }
    } catch (error: any) {
      toast.error('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  const handleViewReport = (report: LabReport) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No reports yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Upload your first lab report to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Upload Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameters
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.map((report) => {
                const criticalCount = report.parameters.filter(p => p.status === 'critical').length;
                const abnormalCount = report.parameters.filter(p => p.status !== 'normal').length;
                
                return (
                  <tr key={report._id} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {report.reportType}
                          </div>
                          <div className="text-sm text-gray-500">
                            {report.filename}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(report.uploadDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {report.parameters.length} parameters
                      </div>
                      {abnormalCount > 0 && (
                        <div className="text-xs text-orange-600">
                          {abnormalCount} need attention
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {criticalCount > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-red-800 bg-red-100">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Critical
                        </span>
                      ) : abnormalCount > 0 ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-orange-800 bg-orange-100">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-800 bg-green-100">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Normal
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <ReportDownload report={report} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ParameterModal
        report={selectedReport}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </>
  );
}