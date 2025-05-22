import { get, post, put, del } from '@/utils/apiHelpers';
import { ProjetInterface } from '@/interfaces/ProjetInterface';

const PROJETS_ENDPOINT = 'projets/';   

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
    description: string;
    name: string;
    success: boolean;
    message: string;
    data: ProjetInterface;
}
export const projetService = {
    async getAllProjets(pageNumber: number = 1, userRole: string = ''): Promise<PaginatedResponse> {
        try {
            let url = `${PROJETS_ENDPOINT}?page=${pageNumber}&per_page=5`;

            console.log('Fetching projets...');
            const response = await get<PaginatedResponse>(url);

            // ✅ Log the items (the actual projects array)
            console.log('Projets data:', response.data);

            return response;
        } catch (error: any) {
            console.error('Detailed error in getAllProjets:', {
                error,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
            throw error;
        }
    },


    
    async getProjetById(id: string, userRole:string): Promise<ProjetResponse> {
        try {
            return await get<ProjetResponse>(`${PROJETS_ENDPOINT}${id}`);
            
        } catch (error) {
            console.error('Error fetching projet:', error);
            throw error;
        }
    },


    async createProjet(projetData : Omit<ProjetInterface, 'id_projet'>, userRole:string): Promise<ProjetInterface> {
        try {
            return await post<ProjetInterface>(PROJETS_ENDPOINT, projetData);
        } catch (error) {
            console.error('Error creating projet:', error);
            throw error;
        }
    },

    // Update user
    async updateProjet(id: string, projetData: Partial<ProjetInterface>): Promise<ProjetInterface> {
        try {
            return await put<ProjetInterface>(`${PROJETS_ENDPOINT}${id}`, projetData);
        } catch (error) {
            console.error('Error updating projet:', error);
            throw error;
        }
    },
    

    // Delete user
    async deleteProjet(id: string, userRole:string): Promise<void> {
        try {
            await del(`${PROJETS_ENDPOINT}${id}`);
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