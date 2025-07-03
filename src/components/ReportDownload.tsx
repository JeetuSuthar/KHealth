import  { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { LabReport } from '../../shared/types';

interface ReportDownloadProps {
  report: LabReport;
  patientInfo?: {
    name: string;
    age: number;
    gender: string;
    patientId: string;
    doctorName?: string;
  };
}

export default function ReportDownload({ report, patientInfo }: ReportDownloadProps) {
  const [downloading, setDownloading] = useState(false);

  const downloadReport = async () => {
    setDownloading(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      let yPosition = 20;

      // Helper functions
      const addColoredRect = (x: number, y: number, width: number, height: number, color: string) => {
        const [r, g, b] = hexToRgb(color);
        pdf.setFillColor(r, g, b);
        pdf.rect(x, y, width, height, 'F');
      };

      const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
};


      const addLine = (y: number, color: string = '#E5E7EB', width: number = 0.3) => {
        pdf.setDrawColor(...hexToRgb(color));
        pdf.setLineWidth(width);
        pdf.line(15, y, pageWidth - 15, y);
      };

      const addText = (text: string, x: number, y: number, maxWidth?: number) => {
        if (maxWidth) {
          const lines = pdf.splitTextToSize(text, maxWidth);
          lines.forEach((line: string, index: number) => {
            pdf.text(line, x, y + (index * 4));
          });
          return lines.length * 4;
        } else {
          pdf.text(text, x, y);
          return 4;
        }
      };

      // Compact Header
      addColoredRect(0, 0, pageWidth, 25, '#1E40AF');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('KARAI HEALTH', 15, 12);
      
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Advanced Health Analytics', 15, 18);

      // Report info on the right
      pdf.setFontSize(7);
      const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
      const reportId = `KH-${Date.now().toString().slice(-6)}`;
      pdf.text(`Generated: ${reportDate}`, pageWidth - 60, 12);
      pdf.text(`Report ID: ${reportId}`, pageWidth - 60, 17);

      yPosition = 35;

      // Compact Title
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('HEALTH ANALYSIS REPORT', 15, yPosition);
      yPosition += 8;

      addLine(yPosition, '#1E40AF', 0.8);
      yPosition += 8;

      // Compact Patient Information
      addColoredRect(15, yPosition - 2, pageWidth - 30, 18, '#F8FAFC');
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PATIENT INFORMATION', 18, yPosition + 3);

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');

      const patientName = patientInfo?.name || 'John Doe';
      const patientAge = patientInfo?.age || 35;
      const patientGender = patientInfo?.gender || 'Male';
      const patientId = patientInfo?.patientId || 'KH-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      const doctorName = patientInfo?.doctorName || 'Dr. Smith';

      pdf.text(`Name: ${patientName}`, 18, yPosition + 8);
      pdf.text(`Age: ${patientAge}`, 18, yPosition + 12);
      pdf.text(`Gender: ${patientGender}`, 90, yPosition + 8);
      pdf.text(`Patient ID: ${patientId}`, 90, yPosition + 12);
      pdf.text(`Doctor: ${doctorName}`, 140, yPosition + 8);
      pdf.text(`Type: ${report.reportType}`, 140, yPosition + 12);

      yPosition += 25;

      // Compact Executive Summary
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('EXECUTIVE SUMMARY', 15, yPosition);
      yPosition += 8;

      const criticalCount = report.parameters.filter(p => p.status === 'critical').length;
      const highCount = report.parameters.filter(p => p.status === 'high').length;
      const lowCount = report.parameters.filter(p => p.status === 'low').length;
      const normalCount = report.parameters.filter(p => p.status === 'normal').length;
      const totalTests = report.parameters.length;

      // Compact summary cards
      const cardWidth = 28;
      const cardHeight = 15;
      const cardSpacing = 35;

      // Critical
      addColoredRect(15, yPosition, cardWidth, cardHeight, criticalCount > 0 ? '#FEE2E2' : '#F9FAFB');
      pdf.setTextColor(criticalCount > 0 ? 220 : 156, criticalCount > 0 ? 38 : 163, criticalCount > 0 ? 38 : 175);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(criticalCount.toString(), 26, yPosition + 7);
      pdf.setFontSize(6);
      pdf.text('CRITICAL', 18, yPosition + 12);

      // High
      addColoredRect(15 + cardSpacing, yPosition, cardWidth, cardHeight, highCount > 0 ? '#FFF7ED' : '#F9FAFB');
      pdf.setTextColor(highCount > 0 ? 234 : 156, highCount > 0 ? 88 : 163, highCount > 0 ? 12 : 175);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(highCount.toString(), 26 + cardSpacing, yPosition + 7);
      pdf.setFontSize(6);
      pdf.text('HIGH', 22 + cardSpacing, yPosition + 12);

      // Low
      addColoredRect(15 + cardSpacing * 2, yPosition, cardWidth, cardHeight, lowCount > 0 ? '#FFFBEB' : '#F9FAFB');
      pdf.setTextColor(lowCount > 0 ? 217 : 156, lowCount > 0 ? 119 : 163, lowCount > 0 ? 6 : 175);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(lowCount.toString(), 26 + cardSpacing * 2, yPosition + 7);
      pdf.setFontSize(6);
      pdf.text('LOW', 23 + cardSpacing * 2, yPosition + 12);

      // Normal
      addColoredRect(15 + cardSpacing * 3, yPosition, cardWidth, cardHeight, normalCount > 0 ? '#F0FDF4' : '#F9FAFB');
      pdf.setTextColor(normalCount > 0 ? 22 : 156, normalCount > 0 ? 163 : 163, normalCount > 0 ? 74 : 175);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(normalCount.toString(), 26 + cardSpacing * 3, yPosition + 7);
      pdf.setFontSize(6);
      pdf.text('NORMAL', 19 + cardSpacing * 3, yPosition + 12);

      // Total Tests
      addColoredRect(15 + cardSpacing * 4, yPosition, cardWidth, cardHeight, '#EEF2FF');
      pdf.setTextColor(79, 70, 229);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(totalTests.toString(), 26 + cardSpacing * 4, yPosition + 7);
      pdf.setFontSize(6);
      pdf.text('TOTAL', 20 + cardSpacing * 4, yPosition + 12);

      yPosition += 20;

      // Compact summary text
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      
      let summaryText = `Analysis of ${totalTests} parameters: `;
      if (criticalCount > 0) summaryText += `${criticalCount} critical, `;
      if (highCount > 0) summaryText += `${highCount} high, `;
      if (lowCount > 0) summaryText += `${lowCount} low, `;
      summaryText += `${normalCount} normal.`;

      const summaryHeight = addText(summaryText, 15, yPosition, pageWidth - 30);
      yPosition += summaryHeight + 6;

      addLine(yPosition);
      yPosition += 8;

      // Compact Laboratory Results
      pdf.setTextColor(30, 64, 175);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.text('LABORATORY RESULTS', 15, yPosition);
      yPosition += 8;

      // Compact table header
      addColoredRect(15, yPosition - 2, pageWidth - 30, 8, '#1E40AF');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(7);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PARAMETER', 18, yPosition + 2);
      pdf.text('VALUE', 75, yPosition + 2);
      pdf.text('UNIT', 95, yPosition + 2);
      pdf.text('NORMAL RANGE', 115, yPosition + 2);
      pdf.text('STATUS', 160, yPosition + 2);
      yPosition += 10;

      // Group parameters by category and display compactly
      const groupedParams = report.parameters.reduce((acc, param) => {
        if (!acc[param.category]) {
          acc[param.category] = [];
        }
        acc[param.category].push(param);
        return acc;
      }, {} as Record<string, typeof report.parameters>);

      Object.entries(groupedParams).forEach(([category, parameters]) => {
        // Compact category header
        addColoredRect(15, yPosition - 1, pageWidth - 30, 6, '#F1F5F9');
        pdf.setTextColor(30, 64, 175);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.text(category.toUpperCase(), 18, yPosition + 2);
        yPosition += 8;

        parameters.forEach((param) => {
          let statusColor: [number, number, number] = [22, 163, 74];
          let statusText = 'NORMAL';
          let bgColor = '#FFFFFF';

          switch (param.status) {
            case 'critical':
              statusColor = [220, 38, 38];
              statusText = 'CRITICAL';
              bgColor = '#FEF2F2';
              break;
            case 'high':
              statusColor = [234, 88, 12];
              statusText = 'HIGH';
              bgColor = '#FFF7ED';
              break;
            case 'low':
              statusColor = [217, 119, 6];
              statusText = 'LOW';
              bgColor = '#FFFBEB';
              break;
          }

          // Row background for abnormal values
          if (param.status !== 'normal') {
            addColoredRect(15, yPosition - 1, pageWidth - 30, 7, bgColor);
          }

          // Parameter details
          pdf.setTextColor(0, 0, 0);
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'normal');
          pdf.text(param.name, 18, yPosition + 2);
          pdf.setFont('helvetica', 'bold');
          pdf.text(param.value.toString(), 75, yPosition + 2);
          pdf.setFont('helvetica', 'normal');
          pdf.text(param.unit, 95, yPosition + 2);
          pdf.text(param.normalRange, 115, yPosition + 2);

          // Status
          pdf.setTextColor(...statusColor);
          pdf.setFont('helvetica', 'bold');
          pdf.text(statusText, 160, yPosition + 2);

          yPosition += 7;
        });

        yPosition += 2;
      });

      // Compact Clinical Recommendations
      if (report.insights && report.insights.length > 0) {
        addLine(yPosition);
        yPosition += 6;

        pdf.setTextColor(30, 64, 175);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        pdf.text('RECOMMENDATIONS', 15, yPosition);
        yPosition += 8;

        // Limit to first 3 insights to save space
        const limitedInsights = report.insights.slice(0, 3);
        
        limitedInsights.forEach((insight) => {
          // Clean up the insight text
          let cleanInsight = insight.replace(/^[•\-\*\s]+/, '').trim();
          cleanInsight = cleanInsight.replace(/^[⚠️📈📉💡✅\s]+/, '').trim();
          
          if (cleanInsight.length > 0) {
            cleanInsight = cleanInsight.charAt(0).toUpperCase() + cleanInsight.slice(1);
          }

          // Add bullet point
          pdf.setTextColor(30, 64, 175);
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'bold');
          pdf.text('•', 18, yPosition);

          // Add recommendation text
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'normal');
          const insightHeight = addText(cleanInsight, 23, yPosition, pageWidth - 40);
          yPosition += insightHeight + 2;
        });

        if (report.insights.length > 3) {
          pdf.setTextColor(100, 116, 139);
          pdf.setFontSize(7);
          pdf.setFont('helvetica', 'italic');
          pdf.text(`+ ${report.insights.length - 3} more recommendations available in detailed report`, 18, yPosition);
          yPosition += 6;
        }
      }

      // Compact Footer
      const footerY = 280;
      addLine(footerY - 5, '#1E40AF', 0.8);
      
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(6);
      pdf.setFont('helvetica', 'normal');
      pdf.text('This report is generated by Karai Health AI system for informational purposes only. Consult your healthcare provider for medical advice.', 15, footerY);

      // Company footer
      pdf.setTextColor(30, 64, 175);
      pdf.setFont('helvetica', 'bold');
      pdf.text('KARAI HEALTH', pageWidth - 40, footerY);

      // Save the PDF
      const fileName = `karai-health-report-${patientName.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center">
      <button
        onClick={downloadReport}
        disabled={downloading}
        className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transform hover:scale-105"
        title="Download your professional health report as PDF"
      >
        {downloading ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        ) : (
          <Download className="h-4 w-4 mr-2" />
        )}
        {downloading ? 'Generating Report...' : 'Download Single-Page Report'}
      </button>

      <div className="flex items-center text-sm text-gray-600">
        <FileText className="h-4 w-4 mr-2" />
       
      </div>
    </div>
  );
}