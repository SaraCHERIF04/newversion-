import { get, post, put, del } from '@/utils/apiHelpers';
import { UserInterface } from '@/interfaces/UserInterface';

const USERS_ENDPOINT = '/users';

interface PaginatedResponse {
    success: boolean;
    message: string;
    data: {
        count: number;
        next: string | null;
        previous: string | null;
        results: UserInterface[];
    };
}

interface UserResponse {
    success: boolean;
    message: string;
    data: UserInterface;
}

export const userService = {
    async getAllUsers(pageNumber:number = 1): Promise<PaginatedResponse> {
        try {
            console.log('Fetching users...');
            const response = await get<PaginatedResponse>(`${USERS_ENDPOINT}?page=${pageNumber}&per_page=5`);
            console.log('Response received:', response);
            return response;
        } catch (error) {
            console.error('Detailed error in getAllUsers:', {
                error,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });
            throw error;
        }
    },

    
    async getUserById(id: string): Promise<UserResponse> {
        try {
            return await get<UserResponse>(`${USERS_ENDPOINT}/${id}`);
            
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },


    async createUser(userData: Omit<UserInterface, 'id'>): Promise<UserInterface> {
        try {
            return await post<UserInterface>(USERS_ENDPOINT, userData);
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    },

    // Update user
    async updateUser(id: string, userData: Partial<UserInterface>): Promise<UserInterface> {
        try {
            return await put<UserInterface>(`${USERS_ENDPOINT}/${id}`, userData);
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    },

    // Delete user
    async deleteUser(id: string): Promise<void> {
        try {
            await del(`${USERS_ENDPOINT}/${id}`);
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    },

    // Search users
    async searchUsers(searchTerm: string): Promise<PaginatedResponse> {
        try {
            return await get<PaginatedResponse>(`${USERS_ENDPOINT}?search=${searchTerm}`);
        } catch (error) {
            console.error('Error searching users:', error);
            throw error;
        }
    }
}; 