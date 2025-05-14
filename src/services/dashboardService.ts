import { get, post, put, del } from '@/utils/apiHelpers';
import { DocumentInterface } from '@/interfaces/DocumentInterface';
import { FinanceDashboard } from '@/interfaces/FinanceDashboard';

const DASHBOARD_ENDPOINT = '/dashboard/';



interface DashboardResponse {
    success: boolean;
    message: string;
    data: FinanceDashboard | null;
}

export const dashboardService = {
    async getDashboard(userRole:string): Promise<DashboardResponse> {
        try {
            const url = `${DASHBOARD_ENDPOINT}${userRole}`;
            console.log('Fetching dashboard...');
            const response = await get<DashboardResponse>(`${url}`);
            console.log('Response received:', response);
            return response;
        } catch (error) {
                console.error('Detailed error in getDashboard:', {
                error,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
            throw error;
        }
    },  
}; 