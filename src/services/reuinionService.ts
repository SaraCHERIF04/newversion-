import { ReuinionInterface } from '@/interfaces/ReuinionInterface';
import { get, post, put, del } from '@/utils/apiHelpers';

const REUNIONS_ENDPOINT = '/reunions';

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
    data: ReuinionInterface[];
}

interface ReunionResponse {
    success: boolean;
    message: string;
    data: ReuinionInterface;
}

export const reunionService = {
    async getAllReunions(pageNumber:number = 1, userRole:string=''): Promise<PaginatedResponse> {
        try {
            let url = '';
            if(userRole === ''){
                url = REUNIONS_ENDPOINT;
            }else{
                url = `${userRole}${REUNIONS_ENDPOINT}`;
            }
            console.log('Fetching projets...');
            const response = await get<PaginatedResponse>(`${url}?page=${pageNumber}&per_page=5`);
            console.log('Response received:', response);
            return response;
        } catch (error) {
                console.error('Detailed error in getAllReunions:', {
                error,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
            throw error;
        }
    },

    
    async getReunionById(id: string, userRole:string): Promise<ReunionResponse> {
        try {
            return await get<ReunionResponse>(`${REUNIONS_ENDPOINT}/${id}`);
            
        } catch (error) {
            console.error('Error fetching reunion:', error);
            throw error;
        }
    },


    async createReunion(reunionData : Omit<ReuinionInterface, 'id'>, userRole:string): Promise<ReuinionInterface> {
        try {
            return await post<ReuinionInterface>(REUNIONS_ENDPOINT, reunionData);
        } catch (error) {
            console.error('Error creating reunion:', error);
            throw error;
        }
    },

    // Update user
    async updateReunion(id: string, reunionData   : Partial<ReuinionInterface>, userRole:string): Promise<ReuinionInterface> {
        try {
            return await put<ReuinionInterface>(`${REUNIONS_ENDPOINT}/${id}`, reunionData);
        } catch (error) {
            console.error('Error updating reunion:', error);
            throw error;
        }
    },

    // Delete user
    async deleteReunion(id: string, userRole:string): Promise<void> {
        try {
            await del(`${REUNIONS_ENDPOINT}/${id}`);
        } catch (error) {
            console.error('Error deleting reunion:', error);
            throw error;
        }
    },

    // Search users
    async searchReunions(searchTerm: string, userRole:string): Promise<PaginatedResponse> {
        try {
            return await get<PaginatedResponse>(`${REUNIONS_ENDPOINT}?search=${searchTerm}`);
        } catch (error) {
            console.error('Error searching reunions:', error);
            throw error;
        }
    }
}; 