import { get, post, put, del } from '@/utils/apiHelpers';
import { DocumentInterface } from '@/interfaces/DocumentInterface';

<<<<<<< HEAD
const DOCUMENTS_ENDPOINT = '/document/';
=======
const DOCUMENTS_ENDPOINT = '/documents';
>>>>>>> upstream/main

interface PaginatedResponse {
    success: boolean;
    message: string;
    pagination: {
        count: number;
        next: string | null;
        previous: string | null;
        current_page: number;
        total_pages: number;
    };
    data: DocumentInterface[];
}

interface DocumentResponse {
    success: boolean;
    message: string;
    data: DocumentInterface;
}

export const documentService = {
    async getAllDocuments(pageNumber:number = 1, userRole:string=''): Promise<PaginatedResponse> {
        try {
            let url = '';
            if(userRole === ''){
                url = DOCUMENTS_ENDPOINT;
            }else{
                url = `${userRole}${DOCUMENTS_ENDPOINT}`;
            }
            console.log('Fetching projets...');
            const response = await get<PaginatedResponse>(`${url}?page=${pageNumber}&per_page=5`);
            console.log('Response received:', response);
            return response;
        } catch (error) {
                console.error('Detailed error in getAllProjets:', {
                error,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
            throw error;
        }
    },

    
    async getDocumentById(id: string, userRole:string): Promise<DocumentResponse> {
        try {
            return await get<DocumentResponse>(`${DOCUMENTS_ENDPOINT}/${id}`);
            
        } catch (error) {
            console.error('Error fetching document:', error);
            throw error;
        }
    },


<<<<<<< HEAD
    async createDocument(documentData : Omit<DocumentInterface, 'id_document'>, userRole:string): Promise<DocumentInterface> {
        try {
            return await post<DocumentInterface>(DOCUMENTS_ENDPOINT, documentData);
=======
    async createDocument(documentData: FormData | Omit<DocumentInterface, 'id'>, userRole:string): Promise<DocumentInterface> {
        try {
            let url = '';
            if(userRole === ''){
                url = DOCUMENTS_ENDPOINT;
            }else{
                url = `${userRole}${DOCUMENTS_ENDPOINT}`;
            }
            return await post<DocumentInterface>(url, documentData);
>>>>>>> upstream/main
        } catch (error) {
            console.error('Error creating document:', error);
            throw error;
        }
    },

<<<<<<< HEAD
    // Update user
    async updateDocument(id: string, documentData   : Partial<DocumentInterface>, userRole:string): Promise<DocumentInterface> {
        try {
            return await put<DocumentInterface>(`${DOCUMENTS_ENDPOINT}/${id}`, documentData);
=======
    // Update document
    async updateDocument(id: string, documentData: FormData | Partial<DocumentInterface>, userRole:string): Promise<DocumentInterface> {
        try {
            let url = '';
            if(userRole === ''){
                url = `${DOCUMENTS_ENDPOINT}/${id}`;
            }else{
                url = `${userRole}${DOCUMENTS_ENDPOINT}/${id}`;
            }
            return await put<DocumentInterface>(url, documentData);
>>>>>>> upstream/main
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    },

    // Delete user
    async deleteDocument(id: string, userRole:string): Promise<void> {
        try {
            await del(`${DOCUMENTS_ENDPOINT}/${id}`);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    },

    // Search users
    async searchDocuments(searchTerm: string, userRole:string): Promise<PaginatedResponse> {
        try {
            return await get<PaginatedResponse>(`${DOCUMENTS_ENDPOINT}?search=${searchTerm}`);
        } catch (error) {
            console.error('Error searching documents:', error);
            throw error;
        }
    }
}; 