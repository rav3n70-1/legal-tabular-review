import pdfplumber
from bs4 import BeautifulSoup
import os
import warnings
import logging

# Suppress pdfminer font warnings
logging.getLogger('pdfminer').setLevel(logging.ERROR)
warnings.filterwarnings('ignore', category=UserWarning, module='pdfminer')

class DocumentParser:
    @staticmethod
    def extract_text(file_path: str) -> str:
        """
        Extract text from a file based on its extension.
        """
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        ext = os.path.splitext(file_path)[1].lower()
        if ext == '.pdf':
            return DocumentParser._extract_from_pdf(file_path)
        elif ext in ['.html', '.htm']:
            return DocumentParser._extract_from_html(file_path)
        elif ext == '.txt':
            return DocumentParser._extract_from_txt(file_path)
        else:
            raise ValueError(f"Unsupported file format: {ext}")

    @staticmethod
    def _extract_from_pdf(path: str) -> str:
        text = []
        try:
            with pdfplumber.open(path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text()
                    if page_text:
                        text.append(page_text)
        except Exception as e:
            logging.error(f"Error extracting PDF {path}: {e}")
            raise
        return "\n".join(text)

    @staticmethod
    def _extract_from_html(path: str) -> str:
        with open(path, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f, 'html.parser')
            return soup.get_text(separator="\n")

    @staticmethod
    def _extract_from_txt(path: str) -> str:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read()
