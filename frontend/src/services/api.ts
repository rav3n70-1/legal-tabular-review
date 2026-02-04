const API_BASE_URL = 'http://localhost:8000/api';

export interface Answer {
    question_text: string;
    value: string;
    confidence: number;
    citation?: string;
}

export interface Project {
    id: string;
    name: string;
    description?: string;
    created_at: string;
    status: string;
    answers: Answer[];
    documents: any[];
}

export const api = {
    async listProjects(): Promise<Project[]> {
        const response = await fetch(`${API_BASE_URL}/list-projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        return response.json();
    },

    async listAvailableFiles(): Promise<string[]> {
        const response = await fetch(`${API_BASE_URL}/list-available-files`);
        if (!response.ok) throw new Error('Failed to fetch files');
        return response.json();
    },

    async createProject(name: string, description: string, filenames: string[]): Promise<Project> {
        const response = await fetch(`${API_BASE_URL}/create-project-async`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, filenames }),
        });
        if (!response.ok) throw new Error('Failed to create project');
        return response.json();
    },

    async getProject(id: string): Promise<Project> {
        const response = await fetch(`${API_BASE_URL}/get-project-info/${id}`);
        if (!response.ok) throw new Error('Failed to fetch project');
        return response.json();
    },

    async generateAnswers(projectId: string, questions: string[]) {
        const response = await fetch(`${API_BASE_URL}/generate-all-answers/${projectId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(questions), // The backend expects questions as body, I should double check route definition
        });
        if (!response.ok) throw new Error('Failed to generate answers');
        return response.json();
    },

    async deleteProject(projectId: string) {
        const response = await fetch(`${API_BASE_URL}/delete-project/${projectId}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete project');
        return response.json();
    }
};
