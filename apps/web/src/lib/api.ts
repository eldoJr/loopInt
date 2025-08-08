const API_BASE_URL = 'http://localhost:3000';

interface RequestConfig extends RequestInit {
  timeout?: number;
}

class ApiError extends Error {
  public status: number;
  public data?: any;

  constructor(
    message: string,
    status: number,
    data?: any
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

const createTimeoutPromise = (timeout: number) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), timeout);
  });
};

const apiRequest = async <T>(
  endpoint: string,
  config: RequestConfig = {}
): Promise<T> => {
  const { timeout = 10000, ...fetchConfig } = config;
  
  const url = `${API_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  
  // Import security modules
  const { authManager } = await import('./auth');
  const { csrfManager } = await import('./csrf');
  const { rateLimiter, RATE_LIMITS } = await import('./rateLimiter');
  
  // Rate limiting check
  const rateLimitKey = `api_${endpoint}`;
  if (!rateLimiter.isAllowed(rateLimitKey, RATE_LIMITS.API)) {
    throw new ApiError('Rate limit exceeded', 429);
  }
  
  // Apply security headers
  const token = authManager.getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...fetchConfig.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
    ...csrfManager.getHeaders(),
  };
  
  const fetchPromise = fetch(url, {
    ...fetchConfig,
    signal: controller.signal,
    headers,
  });

  try {
    const response = await Promise.race([
      fetchPromise,
      createTimeoutPromise(timeout),
    ]) as Response;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `HTTP ${response.status}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0
    );
  }
};

export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    apiRequest<T>(endpoint, { ...config, method: 'GET' }),
  
  post: <T>(endpoint: string, data?: any, config?: RequestConfig) =>
    apiRequest<T>(endpoint, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  put: <T>(endpoint: string, data?: any, config?: RequestConfig) =>
    apiRequest<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
  
  delete: <T>(endpoint: string, config?: RequestConfig) =>
    apiRequest<T>(endpoint, { ...config, method: 'DELETE' }),
};

export { ApiError };