import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:4000/api';

interface ApiResponse<T = any> {
  status: 'ok' | 'error';
  message: string;
  timestamp: string;
  data?: T;
  details?: any;
}

class ApiService {
  private getHeaders(email: string): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'X-Agent-Email': email,
    };
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  // Health Check (no auth required)
  async checkHealth(): Promise<ApiResponse> {
    const response = await fetch(`${API_BASE_URL}/health`);
    return this.handleResponse(response);
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
    const response = await fetch(`${API_BASE_URL}/onboarding`, {
      method: 'POST',
      headers: this.getHeaders(email),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response);
  }

  async getOnboarding(email: string, id?: string): Promise<ApiResponse<any[] | any>> {
    const url = id ? `${API_BASE_URL}/onboarding?id=${id}` : `${API_BASE_URL}/onboarding`;
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
    const response = await fetch(`${API_BASE_URL}/collection`, {
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
  const { email } = useAuth();
  
  if (!email) {
    throw new Error('User must be authenticated to use API');
  }
  
  return {
    // Health check (no auth needed)
    checkHealth: () => apiService.checkHealth(),
    
    // Onboarding
    createOnboarding: (data: Parameters<typeof apiService.createOnboarding>[1]) => 
      apiService.createOnboarding(email, data),
    getOnboarding: (id?: string) => 
      apiService.getOnboarding(email, id),
    
    // Collections
    createCollection: (data: Parameters<typeof apiService.createCollection>[1]) => 
      apiService.createCollection(email, data),
    getCollections: (id?: string, outletId?: string) => 
      apiService.getCollections(email, id, outletId),
  };
}
