import { queryClient } from './queryClient';

// Request interceptor for adding auth tokens
export const addAuthInterceptor = (request: RequestInit): RequestInit => {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    return {
      ...request,
      headers: {
        ...request.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }
  
  return request;
};

// Response interceptor for handling auth errors
export const handleAuthErrors = (response: Response): Response => {
  if (response.status === 401) {
    // Clear auth data and redirect to login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    queryClient.clear();
    window.location.href = '/login';
  }
  
  return response;
};

// Response interceptor for handling network errors
export const handleNetworkErrors = (error: Error): never => {
  if (error.message === 'Failed to fetch') {
    console.error('Network error - server may be down');
  }
  
  throw error;
};