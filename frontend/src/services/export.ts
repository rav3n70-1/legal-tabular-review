export class ExportService {
    /**
     * Export data to CSV format
     */
    static exportToCSV(data: any[], filename: string = 'export.csv') {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        // Get all unique keys from the data
        const headers = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));

        // Create CSV content
        const csvContent = [
            // Header row
            headers.join(','),
            // Data rows
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header] ?? '';
                    // Escape quotes and wrap in quotes if contains comma or newline
                    const stringValue = String(value).replace(/"/g, '""');
                    return stringValue.includes(',') || stringValue.includes('\n')
                        ? `"${stringValue}"`
                        : stringValue;
                }).join(',')
            )
        ].join('\n');

        this.downloadFile(csvContent, filename, 'text/csv');
    }

    /**
     * Export extraction results to CSV
     */
    static exportExtractionResults(
        projectName: string,
        questions: string[],
        documents: Array<{
            filename: string;
            answers: Array<{
                question_text: string;
                value: string;
                confidence: number;
                citation?: string;
            }>;
        }>
    ) {
        const rows: any[] = [];

        questions.forEach(question => {
            const row: any = {
                'Field/Question': question
            };

            documents.forEach(doc => {
                const answer = doc.answers.find(a => a.question_text === question);
                row[`${doc.filename} - Value`] = answer?.value || 'N/A';
                row[`${doc.filename} - Confidence`] = answer ? `${(answer.confidence * 100).toFixed(0)}%` : 'N/A';
                if (answer?.citation) {
                    row[`${doc.filename} - Citation`] = answer.citation;
                }
            });

            rows.push(row);
        });

        const filename = `${projectName.replace(/[^a-z0-9]/gi, '_')}_extraction_results.csv`;
        this.exportToCSV(rows, filename);
    }

    /**
     * Export to Excel-compatible format (CSV with UTF-8 BOM)
     */
    static exportToExcel(data: any[], filename: string = 'export.csv') {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        const headers = Array.from(new Set(data.flatMap(obj => Object.keys(obj))));

        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header => {
                    const value = row[header] ?? '';
                    const stringValue = String(value).replace(/"/g, '""');
                    return stringValue.includes(',') || stringValue.includes('\n')
                        ? `"${stringValue}"`
                        : stringValue;
                }).join(',')
            )
        ].join('\n');

        // Add UTF-8 BOM for Excel compatibility
        const bom = '\uFEFF';
        this.downloadFile(bom + csvContent, filename, 'text/csv;charset=utf-8');
    }

    /**
     * Export extraction results to Excel format
     */
    static exportExtractionResultsToExcel(
        projectName: string,
        questions: string[],
        documents: Array<{
            filename: string;
            answers: Array<{
                question_text: string;
                value: string;
                confidence: number;
                citation?: string;
            }>;
        }>
    ) {
        const rows: any[] = [];

        questions.forEach(question => {
            const row: any = {
                'Field/Question': question
            };

            documents.forEach(doc => {
                const answer = doc.answers.find(a => a.question_text === question);
                row[`${doc.filename} - Value`] = answer?.value || 'N/A';
                row[`${doc.filename} - Confidence`] = answer ? `${(answer.confidence * 100).toFixed(0)}%` : 'N/A';
                if (answer?.citation) {
                    row[`${doc.filename} - Citation`] = answer.citation;
                }
            });

            rows.push(row);
        });

        const filename = `${projectName.replace(/[^a-z0-9]/gi, '_')}_extraction_results.csv`;
        this.exportToExcel(rows, filename);
    }

    /**
     * Helper to download file
     */
    private static downloadFile(content: string, filename: string, mimeType: string) {
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    }
}
