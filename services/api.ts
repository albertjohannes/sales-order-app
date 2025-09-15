import { API_CONFIG } from '@/config/api';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = API_CONFIG.getCurrentUrl();

interface ApiResponse<T = any> {
  status: 'ok' | 'error';
  message: string;
  timestamp: string;
  data?: T;
  details?: any;
}

class ApiService {
  private logRequest(method: 'GET' | 'POST', url: string, email?: string) {
    console.log(`[API] ${method} ${url}${email ? ` (${email})` : ''}`);
  }

  private getHeaders(email: string, isMultipart: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      'X-Agent-Email': email,
    };
    
    if (!isMultipart) {
      headers['Content-Type'] = 'application/json';
    }
    // For multipart, let the browser set the Content-Type with boundary
    
    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Network request failed') {
        throw new Error('Unable to connect to server. Please check your internet connection and try again.');
      }
      throw error;
    }
  }

  // Health Check (no auth required)
  async checkHealth(): Promise<ApiResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const url = `${API_BASE_URL}/health`;
      this.logRequest('GET', url);
      console.log(`[API] Health check URL: ${url}`);
      const response = await fetch(url, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      console.log(`[API] Health check response: ${response.status} ${response.statusText}`);
      return this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`[API] Health check error:`, error);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      throw error;
    }
  }

  // Onboarding APIs
  async createOnboarding(email: string, data: {
    name: string;
    streetAddress: string;
    province?: { code: string; name: string } | null;
    regency?: { code: string; name: string } | null;
    district?: { code: string; name: string } | null;
    village?: { code: string; name: string } | null;
    postalCode?: string | null;
    latitude?: string | null;
    longitude?: string | null;
    ktpPhoto?: string | null;
    outsidePhotos?: string[];
    insidePhotos?: string[];
    inventoryPhotos?: string[];
  }): Promise<ApiResponse<{ id: string; createdAt: string }>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for larger data
    
    try {
      const url = `${API_BASE_URL}/onboarding`;
      this.logRequest('POST', url, email);
      
      // Log payload size for debugging
      const payloadSize = JSON.stringify(data).length;
      console.log(`[API] Payload size: ${payloadSize} characters (${(payloadSize / 1024).toFixed(2)} KB)`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(email),
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      console.log(`[API] Response status: ${response.status} ${response.statusText}`);
      return this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`[API] Error in createOnboarding:`, error);
      console.error(`[API] Error type:`, typeof error);
      console.error(`[API] Error name:`, error instanceof Error ? error.name : 'N/A');
      console.error(`[API] Error message:`, error instanceof Error ? error.message : 'N/A');
      console.error(`[API] Error stack:`, error instanceof Error ? error.stack : 'N/A');
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your connection and try again.');
      }
      if (error instanceof Error && error.message.includes('Network request failed')) {
        throw new Error('Network connection failed. Please check your internet connection and try again.');
      }
      // Pass through the original error with more details
      throw new Error(`API Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // New method for multipart file uploads
  async createOnboardingWithFiles(email: string, formData: FormData): Promise<ApiResponse<{ id: string; photoUrls: any }>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for file uploads
    
    try {
      const url = `${API_BASE_URL}/onboarding`;
      this.logRequest('POST', url, email);
      console.log(`[API] Uploading files with FormData`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(email, true), // isMultipart = true
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      console.log(`[API] File upload response status: ${response.status} ${response.statusText}`);
      return this.handleResponse(response);
    } catch (error) {
      clearTimeout(timeoutId);
      console.error(`[API] Error in createOnboardingWithFiles:`, error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('File upload timeout. Please check your connection and try again.');
      }
      if (error instanceof Error && error.message.includes('Network request failed')) {
        throw new Error('Network connection failed. Please check your internet connection and try again.');
      }
      throw new Error(`File Upload Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async getOnboarding(email: string, id?: string): Promise<ApiResponse<any[] | any>> {
    const url = id ? `${API_BASE_URL}/onboarding?id=${id}` : `${API_BASE_URL}/onboarding`;
    this.logRequest('GET', url, email);
    const response = await fetch(url, {
      headers: this.getHeaders(email),
    });
    return this.handleResponse(response);
  }

  // Collection APIs
  async createCollection(email: string, data: {
    outletId: string;
    amount: number;
    method?: 'cash' | 'transfer' | 'qr';
    note?: string | null;
    attachments?: string[];
  }): Promise<ApiResponse<{ id: string; createdAt: string }>> {
    const url = `${API_BASE_URL}/collection`;
    this.logRequest('POST', url, email);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(email),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getCollections(email: string, id?: string, outletId?: string): Promise<ApiResponse<any[] | any>> {
    let url = `${API_BASE_URL}/collection`;
    const params = new URLSearchParams();
    
    if (id) params.append('id', id);
    if (outletId) params.append('outletId', outletId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    this.logRequest('GET', url, email);
    const response = await fetch(url, {
      headers: this.getHeaders(email),
    });
    return this.handleResponse(response);
  }
}

// Create singleton instance
export const apiService = new ApiService();

// Hook for using API with current user's email
export function useApi() {
  const { email, isAuthenticated } = useAuth();
  
  return {
    // Health check (no auth needed)
    checkHealth: () => apiService.checkHealth(),
    
    // Onboarding (requires auth)
    createOnboarding: (data: Parameters<typeof apiService.createOnboarding>[1]) => {
      if (!isAuthenticated || !email) {
        throw new Error('User must be authenticated to create onboarding');
      }
      return apiService.createOnboarding(email, data);
    },
    createOnboardingWithFiles: (formData: FormData) => {
      if (!isAuthenticated || !email) {
        throw new Error('User must be authenticated to create onboarding with files');
      }
      return apiService.createOnboardingWithFiles(email, formData);
    },
    getOnboarding: (id?: string) => {
      if (!isAuthenticated || !email) {
        throw new Error('User must be authenticated to get onboarding data');
      }
      return apiService.getOnboarding(email, id);
    },
    
    // Collections (requires auth)
    createCollection: (data: Parameters<typeof apiService.createCollection>[1]) => {
      if (!isAuthenticated || !email) {
        throw new Error('User must be authenticated to create collection');
      }
      return apiService.createCollection(email, data);
    },
    getCollections: (id?: string, outletId?: string) => {
      if (!isAuthenticated || !email) {
        throw new Error('User must be authenticated to get collection data');
      }
      return apiService.getCollections(email, id, outletId);
    },
    
    // Auth status
    isAuthenticated,
    email,
  };
}
