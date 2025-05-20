import { 
  Reservation, 
  DetailedReservation, 
  CreateReservationRequest, 
  CreateReservationResponse,
  PatchReservationRequest,
  CancelReservationRequest,
  CancelReservationResponse,
  CheckInRequest,
  CheckInResponse,
  CheckOutResponse,
  ReservationFilters,
  UserProfile,
  UserProfileListResponse,
  RoomTypesResponse,
  PropertiesResponse
} from './types';
import { getApiBaseUrl, apiConfig } from './config';

// Get the API base URL from the configuration
const API_BASE_URL = getApiBaseUrl();

// Helper function for API calls
const fetchAPI = async <T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      ...options,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timeoutId);
  }
};

export const reservationApi = {
  // Get reservations list with optional filters
  getReservations: (filters?: ReservationFilters): Promise<Reservation[]> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return fetchAPI<Reservation[]>(`/frontend_api/reservations${queryString}`);
  },

  // Get detailed reservation by ID
  getReservationById: (id: number): Promise<DetailedReservation> => {
    return fetchAPI<DetailedReservation>(`/frontend_api/reservations/${id}`);
  },

  // Create new reservation
  createReservation: (data: CreateReservationRequest): Promise<CreateReservationResponse> => {
    return fetchAPI<CreateReservationResponse>('/frontend_api/reservations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Update reservation
  updateReservation: (id: number, data: PatchReservationRequest): Promise<DetailedReservation> => {
    return fetchAPI<DetailedReservation>(`/frontend_api/reservations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // Cancel reservation
  cancelReservation: (id: number, reason: string): Promise<CancelReservationResponse> => {
    return fetchAPI<CancelReservationResponse>(`/frontend_api/reservations/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason } as CancelReservationRequest),
    });
  },

  // Check-in guest
  checkInGuest: (id: number, data: CheckInRequest): Promise<CheckInResponse> => {
    return fetchAPI<CheckInResponse>(`/frontend_api/reservations/${id}/check-in`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Check-out guest
  checkOutGuest: (id: number): Promise<CheckOutResponse> => {
    return fetchAPI<CheckOutResponse>(`/frontend_api/reservations/${id}/check-out`, {
      method: 'POST',
    });
  },

  // Transform reservations
  transformReservations: (data: Reservation[]): Promise<Reservation[]> => {
    return fetchAPI<Reservation[]>('/frontend_api/reservations/transform', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Optimize reservations
  optimizeReservations: (data: Reservation[]): Promise<Reservation[]> => {
    return fetchAPI<Reservation[]>('/frontend_api/reservations/optimize', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};

export const profileApi = {
  // Get all profiles
  getProfiles: (): Promise<UserProfileListResponse> => {
    return fetchAPI<UserProfileListResponse>('/frontend_api/profiles');
  },

  // Get profile by ID
  getProfileById: (id: number): Promise<UserProfile> => {
    return fetchAPI<UserProfile>(`/frontend_api/profiles/${id}`);
  }
};

export const roomTypeApi = {
  // Get all room types
  getRoomTypes: (): Promise<RoomTypesResponse> => {
    return fetchAPI<RoomTypesResponse>('/frontend_api/room-types');
  }
};

export const propertyApi = {
  // Get all properties
  getProperties: (): Promise<PropertiesResponse> => {
    return fetchAPI<PropertiesResponse>('/frontend_api/properties');
  }
}; 