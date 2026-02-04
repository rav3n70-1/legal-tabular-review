# 📊 Legal Tabular Review

> AI-powered document extraction and comparison tool for legal documents

A modern web application that uses Google's Gemini AI to extract structured data from legal documents (PDFs, HTML) and present them in a tabular format for easy comparison and analysis.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.9+-blue.svg)
![React](https://img.shields.io/badge/react-18+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)

## ✨ Features

### 🎯 Core Functionality
- **AI-Powered Extraction** - Uses Gemini AI to extract information from legal documents
- **Multi-Document Support** - Process multiple PDFs and HTML files simultaneously
- **Custom Field Editor** - Define your own extraction fields or use 15+ predefined legal fields
- **Smart Extraction** - Analyzes document content with confidence scores and citations

### 📊 Data Management
- **Tabular Comparison** - View extracted data side-by-side in a clean table format
- **Export to CSV/Excel** - Download results for further analysis
- **Advanced Filtering** - Search, filter by confidence, and apply quick filters
- **Project Management** - Organize multiple extraction projects

### 🎨 Modern UI
- **Professional Design** - Clean, modern interface with smooth animations
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Dark Mode Ready** - Built with extensible design system
- **Real-time Updates** - Live feedback on extraction progress

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- Node.js 16+
- Google Gemini API Key ([Get one here](https://ai.google.dev/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/legal-tabular-review.git
cd legal-tabular-review
```

2. **Set up the backend**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

3. **Configure environment variables**
```bash
# Create .env file in backend directory
echo "GEMINI_API_KEY=your_api_key_here" > .env
```

4. **Set up the frontend**
```bash
cd ../frontend
npm install
```

5. **Add your documents**
```bash
# Place your PDF/HTML files in the data directory
mkdir -p data
# Copy your legal documents to data/
```

### Running the Application

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app:app --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` in your browser!

## 📖 Usage

### Creating a Project

1. **Navigate to the home page**
2. **Enter a project name** (e.g., "Tesla Supply Agreement Review")
3. **Select documents** from your data folder
4. **Click "Create Project"**

### Extracting Data

1. **Open your project**
2. **Customize fields** (optional):
   - Click "Edit Fields"
   - Add custom fields or use quick-add suggestions
   - Remove unwanted fields
3. **Click "Run Extraction"**
4. **Wait for AI processing** (progress shown in real-time)

### Analyzing Results

1. **View the comparison table** with extracted values
2. **Check confidence scores** (color-coded badges)
3. **Expand citations** to see source text
4. **Apply filters**:
   - Search across all results
   - Set minimum confidence threshold
   - Show only high-confidence results

### Exporting Data

1. **Click "Export CSV"** for standard CSV format
2. **Click "Export Excel"** for Excel-compatible format
3. **File downloads automatically** with project name

## 🏗️ Architecture

### Backend (FastAPI + Python)
```
backend/
├── app.py                 # Main FastAPI application
├── src/
│   ├── api/
│   │   └── routes.py      # API endpoints
│   ├── services/
│   │   ├── project_service.py   # Project management
│   │   └── llm_service.py       # Gemini AI integration
│   ├── indexing/
│   │   └── parser.py      # Document parsing (PDF/HTML)
│   ├── storage/
│   │   └── db.py          # SQLite database
│   └── models/
│       └── schemas.py     # Data models
└── data/                  # Document storage
```

### Frontend (React + TypeScript)
```
frontend/
├── src/
│   ├── pages/
│   │   ├── ProjectList.tsx      # Projects overview
│   │   └── ProjectDetail.tsx    # Project details & results
│   ├── components/
│   │   ├── ComparisonTable.tsx  # Results table
│   │   ├── FieldEditor.tsx      # Custom field editor
│   │   ├── FilterPanel.tsx      # Advanced filtering
│   │   └── DocumentPreview.tsx  # Document preview modal
│   ├── services/
│   │   ├── api.ts               # API client
│   │   └── export.ts            # Export functionality
│   └── index.css          # Design system
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (#6366f1)
- **Secondary**: Purple (#8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Danger**: Red (#ef4444)

### Components
- Buttons (Primary, Secondary, Danger)
- Cards with elevation
- Badges for status indicators
- Professional tables
- Form inputs with focus states
- Loading spinners
- Modal dialogs

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
GEMINI_API_KEY=your_gemini_api_key
```

### Supported File Formats
- PDF (`.pdf`)
- HTML (`.html`, `.htm`)
- Text (`.txt`)

### Predefined Legal Fields
- Effective Date
- Expiration Date
- Governing Law
- Jurisdiction
- Parties Involved
- Termination Clause
- Payment Terms
- Confidentiality Period
- Liability Cap
- Force Majeure
- Dispute Resolution
- Notice Period
- Renewal Terms
- Indemnification
- Intellectual Property Rights

## 📊 API Endpoints

### Projects
- `GET /api/list-projects` - List all projects
- `POST /api/create-project-async` - Create new project
- `GET /api/get-project-info/{id}` - Get project details
- `DELETE /api/delete-project/{id}` - Delete project

### Extraction
- `POST /api/generate-all-answers/{id}` - Run extraction
- `GET /api/list-available-files` - List files in data folder

### Health
- `GET /health` - API health check

## 🛠️ Development

### Backend Development
```bash
cd backend
# Install dev dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

### Database
The application uses SQLite for simplicity. The database file is created automatically at `backend/legal_review.db`.
## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for powerful document understanding
- [FastAPI](https://fastapi.tiangolo.com/) for the excellent Python web framework
- [React](https://react.dev/) for the UI framework
- [pdfplumber](https://github.com/jsvine/pdfplumber) for PDF parsing
- [Beautiful Soup](https://www.crummy.com/software/BeautifulSoup/) for HTML parsing


