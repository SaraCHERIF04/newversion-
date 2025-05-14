import { get, post, put, del } from '@/utils/apiHelpers';
import { ProjetInterface } from '@/interfaces/ProjetInterface';
import { SousProjetInterface } from '@/interfaces/SousProjetInterface';

const SOUS_PROJETS_ENDPOINT = '/sous-projets';

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
    data: SousProjetInterface[];
}

interface SousProjetResponse {
    success: boolean;
    message: string;
    data: SousProjetInterface[];
}

export const sousProjetService = {
    async getAllSousProjets(pageNumber:number = 1, userRole:string=''): Promise<PaginatedResponse> {
        try {
            let url = '';
            if(userRole === ''){
                url = SOUS_PROJETS_ENDPOINT;
            }else{
                url = `${userRole}${SOUS_PROJETS_ENDPOINT}`;
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

    
    async getSousProjetById(id: string, userRole:string): Promise<SousProjetResponse> {
        try {
            return await get<SousProjetResponse>(`${SOUS_PROJETS_ENDPOINT}/${id}`);
            
        } catch (error) {
            console.error('Error fetching projet:', error);
            throw error;
        }
    },


    async createSousProjet(sousProjetData : Omit<SousProjetInterface, 'id'>, userRole:string): Promise<SousProjetInterface> {
        try {
            return await post<SousProjetInterface>(SOUS_PROJETS_ENDPOINT, sousProjetData);
        } catch (error) {
            console.error('Error creating projet:', error);
            throw error;
        }
    },

    // Update user
    async updateSousProjet(id: string, sousProjetData   : Partial<SousProjetInterface>, userRole:string): Promise<SousProjetInterface> {
        try {
            return await put<SousProjetInterface>(`${SOUS_PROJETS_ENDPOINT}/${id}`, sousProjetData);
        } catch (error) {
            console.error('Error updating projet:', error);
            throw error;
        }
    },

    // Delete user
    async deleteSousProjet(id: string, userRole:string): Promise<void> {
        try {
            await del(`${SOUS_PROJETS_ENDPOINT}/${id}`);
        } catch (error) {
            console.error('Error deleting projet:', error);
            throw error;
        }
    },

    // Search users
    async searchSousProjets(searchTerm: string, userRole:string): Promise<PaginatedResponse> {
        try {
            return await get<PaginatedResponse>(`${SOUS_PROJETS_ENDPOINT}?search=${searchTerm}`);
        } catch (error) {
            console.error('Error searching projets:', error);
            throw error;
        }
    }
}; 