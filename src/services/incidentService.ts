import { IncidentInterface } from '@/interfaces/IncidentInterface';
import { get, post, put, del } from '@/utils/apiHelpers';

const INCIDENTS_ENDPOINT = '/incidents';

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
    data: IncidentInterface[];
}

interface IncidentResponse {
    success: boolean;
    message: string;
    data: IncidentInterface;
}

export const incidentService = {
    async getAllIncidents(pageNumber:number = 1, userRole:string=''): Promise<PaginatedResponse> {
        try {
            let url = '';
            if(userRole === ''){
                url = INCIDENTS_ENDPOINT;
            }else{
                url = `${userRole}${INCIDENTS_ENDPOINT}`;
            }
            console.log('Fetching projets...');
            const response = await get<PaginatedResponse>(`${url}?page=${pageNumber}&per_page=5`);
            console.log('Response received:', response);
            return response;
        } catch (error) {
                console.error('Detailed error in getAllIncidents:', {
                error,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
            throw error;
        }
    },

    
    async getIncidentById(id: string, userRole:string): Promise<IncidentResponse> {
        try {
            return await get<IncidentResponse>(`${INCIDENTS_ENDPOINT}/${id}`);
            
        } catch (error) {
            console.error('Error fetching incident:', error);
            throw error;
        }
    },


    async createIncident(incidentData : Omit<IncidentInterface, 'id'>, userRole:string): Promise<IncidentInterface> {
        try {
            return await post<IncidentInterface>(INCIDENTS_ENDPOINT, incidentData);
        } catch (error) {
            console.error('Error creating incident:', error);
            throw error;
        }
    },

    // Update user
    async updateIncident(id: string, incidentData   : Partial<IncidentInterface>, userRole:string): Promise<IncidentInterface> {
        try {
            return await put<IncidentInterface>(`${INCIDENTS_ENDPOINT}/${id}`, incidentData);
        } catch (error) {
            console.error('Error updating incident:', error);
            throw error;
        }
    },

    // Delete user
    async deleteIncident(id: string, userRole:string): Promise<void> {
        try {
            await del(`${INCIDENTS_ENDPOINT}/${id}`);
        } catch (error) {
            console.error('Error deleting incident:', error);
            throw error;
        }
    },

    // Search incidents
    async searchIncidents(searchTerm: string, userRole:string): Promise<PaginatedResponse> {
        try {
            return await get<PaginatedResponse>(`${INCIDENTS_ENDPOINT}?search=${searchTerm}`);
        } catch (error) {
            console.error('Error searching incidents:', error);
            throw error;
        }
    }
}; 