# Lab Report Analyzer

A modern web application for uploading and analyzing lab reports with AI-powered health insights.

## Features

✅ **Smart Upload**: Upload PDF or image lab reports with OCR text extraction
✅ **Health Analysis**: Automatic extraction of health parameters with status indicators
✅ **AI Insights**: Intelligent health recommendations and alerts
✅ **Trend Tracking**: Visualize health parameter trends over time
✅ **Mock Authentication**: Simple login/signup system using localStorage
✅ **Report Downloads**: Export analysis results as PDF reports
✅ **Responsive Design**: Works perfectly on desktop and mobile

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Storage**: localStorage (for demo purposes)
- **OCR**: Tesseract.js
- **Charts**: Recharts
- **PDF Generation**: jsPDF + html2canvas

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view the application.

## How to Use

1. **Create Account**: Click "Create account" and fill in your details
2. **Upload Report**: Drag & drop or click to upload a lab report (PDF/image)
3. **View Analysis**: See extracted health parameters with status indicators
4. **Track Trends**: View health parameter trends over time
5. **Download Reports**: Export your analysis as PDF

## Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard layout
│   ├── FileUpload.tsx   # File upload with OCR
│   ├── ReportsTable.tsx # Reports listing and management
│   ├── TrendsChart.tsx  # Health trends visualization
│   └── ...
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── services/           # API services
│   ├── authService.ts  # Mock authentication operations
│   └── reportService.ts # Report management and health analysis
└── shared/            # Shared types and utilities
    └── types/         # TypeScript type definitions
```

## Health Parameters Supported

The application can extract and analyze these health parameters:

- **Blood Count**: Hemoglobin, Hematocrit, White Blood Cells, Platelets
- **Metabolic**: Glucose
- **Lipid Profile**: Total Cholesterol, HDL, LDL, Triglycerides
- **Kidney Function**: Creatinine, BUN
- **Liver Function**: ALT, AST
- **Thyroid**: TSH
- **Vitamins**: Vitamin D

## Demo Features

- Mock authentication using localStorage
- Sample health data for demonstration
- OCR text extraction from images
- Health parameter analysis with status indicators
- Trend visualization with dummy data
- PDF report generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details