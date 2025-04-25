import { post } from '@/utils/apiHelpers';
import { setAuthToken } from '@/utils/apiHelpers';
import { requestNotificationPermission, getFCMToken } from './firebase';

interface LoginCredentials {
  email: string;
  password: string;
}

interface SetPasswordResponse {
  success: boolean;
  message: string;
}



interface LoginResponse {
  data: {
    data: {
      id_utilisateur: string;
      nom: string;
      email: string;
      role_de_utilisateur: string;
      tokens: {
        access: string;
      };
    };
  };
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    // Request notification permission and get FCM token
    let fcmToken = null;
    try {
      const permission = await requestNotificationPermission();
      if (permission) {
        fcmToken = await getFCMToken();
      }
    } catch (error) {
      console.warn('Failed to get FCM token:', error);
    // Continue with login even if FCM token fails
    }

    const response = await post<LoginResponse>('/auth', {
      email: credentials.email,
      mot_de_passe: credentials.password,
      action: 'login',
      fcm_token: fcmToken // Send FCM token to backend
    });

    setAuthToken(response.data.data.tokens.access);
    // console.log('FCM Token:', fcmToken);
    localStorage.setItem('userRole', response.data.data.role_de_utilisateur);
    localStorage.setItem('userId', response.data.data.id_utilisateur);
    localStorage.setItem('userName', response.data.data.nom);
    localStorage.setItem('userEmail', response.data.data.email);
    
    return response;
  } catch (error) {
    throw error;
  }
};




export const addPassword = async (password: string, token: string) => {
  try {
    // console.log(password, token);
    const response = await post<SetPasswordResponse>('/set-password', {
      password: password,
      token: token, 

    });
  } catch (error) {
    throw error;
  }
};


export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userEmail');
}; 