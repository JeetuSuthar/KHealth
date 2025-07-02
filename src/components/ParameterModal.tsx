import React from 'react';
import { X, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';
import { LabReport } from '../../shared/types';

interface ParameterModalProps {
  report: LabReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ParameterModal({ report, isOpen, onClose }: ParameterModalProps) {
  if (!isOpen || !report) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high':
        return <TrendingUp className="h-5 w-5 text-orange-600" />;
      case 'low':
        return <TrendingDown className="h-5 w-5 text-yellow-600" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-red-50 border-red-200';
      case 'high':
        return 'bg-orange-50 border-orange-200';
      case 'low':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-green-50 border-green-200';
    }
  };

  const groupedParameters = report.parameters.reduce((acc, param) => {
    if (!acc[param.category]) {
      acc[param.category] = [];
    }
    acc[param.category].push(param);
    return acc;
  }, {} as Record<string, typeof report.parameters>);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {report.reportType}
                </h3>
                <p className="text-sm text-gray-500">
                  Uploaded on {new Date(report.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Health Insights */}
              {report.insights.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                    <h4 className="font-medium text-blue-900">Health Insights</h4>
                  </div>
                  <div className="space-y-2">
                    {report.insights.map((insight, index) => (
                      <p key={index} className="text-sm text-blue-800">
                        {insight}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Parameters by Category */}
              {Object.entries(groupedParameters).map(([category, parameters]) => (
                <div key={category} className="space-y-3">
                  <h4 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                    {category}
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {parameters.map((param, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${getStatusColor(param.status)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{param.name}</h5>
                          {getStatusIcon(param.status)}
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Value:</span>
                            <span className="font-medium">
                              {param.value} {param.unit}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Normal Range:</span>
                            <span className="text-gray-700">{param.normalRange} {param.unit}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium capitalize ${
                              param.status === 'critical' ? 'text-red-600' :
                              param.status === 'high' ? 'text-orange-600' :
                              param.status === 'low' ? 'text-yellow-600' :
                              'text-green-600'
                            }`}>
                              {param.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}