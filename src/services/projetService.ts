import { get, post, put, del } from '@/utils/apiHelpers';
import { ProjetInterface } from '@/interfaces/ProjetInterface';

<<<<<<< HEAD
const PROJETS_ENDPOINT = 'projets/';   
=======
const PROJETS_ENDPOINT = '/projets';
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
    data: ProjetInterface[];
}

interface ProjetResponse {
<<<<<<< HEAD
    description: string;
    name: string;
    success: boolean;
    message: string;
    data: ProjetInterface; 
} 
export const projetService = {
    async getAllProjets(pageNumber: number = 1, userRole: string = ''): Promise<PaginatedResponse> {
        try {
            const url = `${PROJETS_ENDPOINT}?page=${pageNumber}&per_page=5`;

            console.log('Fetching projets...');
            const response = await get<PaginatedResponse>(url);

            // ✅ Log the items (the actual projects array)
            console.log('Projets data:', response.data);

            return response;
        } catch (error) {
            interface ApiError {
                response?: {
                    status?: number;
                    data?: unknown;
                    headers?: unknown;
                };
            }
            const apiError = error as ApiError;
            console.error('Detailed error in getAllProjets:', {
                error,
                status: apiError.response?.status,
                data: apiError.response?.data,
                headers: apiError.response?.headers
=======
    success: boolean;
    message: string;
    data: ProjetInterface;
}

export const projetService = {
    async getAllProjets(pageNumber:number = 1, userRole:string=''): Promise<PaginatedResponse> {
        try {
            let url = '';
            if(userRole === ''){
                url = PROJETS_ENDPOINT;
            }else{
                url = `${userRole}${PROJETS_ENDPOINT}`;
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
>>>>>>> upstream/main
            });
            throw error;
        }
    },

<<<<<<< HEAD

    
    async getProjetById(id: string, userRole:string): Promise<ProjetResponse> {
        try {
            return await get<ProjetResponse>(`${PROJETS_ENDPOINT}${id}`);
=======
    
    async getProjetById(id: string, userRole:string): Promise<ProjetResponse> {
        try {
            return await get<ProjetResponse>(`${PROJETS_ENDPOINT}/${id}`);
>>>>>>> upstream/main
            
        } catch (error) {
            console.error('Error fetching projet:', error);
            throw error;
        }
    },


<<<<<<< HEAD
    async createProjet(projetData : Omit<ProjetInterface, 'id_projet'>, userRole:string): Promise<ProjetInterface> {
=======
    async createProjet(projetData : Omit<ProjetInterface, 'id'>, userRole:string): Promise<ProjetInterface> {
>>>>>>> upstream/main
        try {
            return await post<ProjetInterface>(PROJETS_ENDPOINT, projetData);
        } catch (error) {
            console.error('Error creating projet:', error);
            throw error;
        }
    },

    // Update user
<<<<<<< HEAD
    async updateProjet(id: string, projetData: Partial<ProjetInterface>): Promise<ProjetInterface> {
        try {
            return await put<ProjetInterface>(`${PROJETS_ENDPOINT}${id}`, projetData);
=======
    async updateProjet(id: string, projetData   : Partial<ProjetInterface>, userRole:string): Promise<ProjetInterface> {
        try {
            return await put<ProjetInterface>(`${PROJETS_ENDPOINT}/${id}`, projetData);
>>>>>>> upstream/main
        } catch (error) {
            console.error('Error updating projet:', error);
            throw error;
        }
    },
<<<<<<< HEAD
    
=======
>>>>>>> upstream/main

    // Delete user
    async deleteProjet(id: string, userRole:string): Promise<void> {
        try {
<<<<<<< HEAD
            await del(`${PROJETS_ENDPOINT}${id}`);
=======
            await del(`${PROJETS_ENDPOINT}/${id}`);
>>>>>>> upstream/main
        } catch (error) {
            console.error('Error deleting projet:', error);
            throw error;
        }
    },

    // Search users
    async searchProjets(searchTerm: string, userRole:string): Promise<PaginatedResponse> {
        try {
            return await get<PaginatedResponse>(`${PROJETS_ENDPOINT}?search=${searchTerm}`);
        } catch (error) {
            console.error('Error searching projets:', error);
            throw error;
        }
    }
}; 